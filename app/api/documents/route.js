import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/documents - Récupérer tous les documents accessibles par l'utilisateur
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const entityId = searchParams.get('entityId');

    // Récupérer les SCI auxquelles l'utilisateur a accès
    const userScis = await prisma.userOnSCI.findMany({
      where: { userId: session.user.id },
      select: { sciId: true }
    });

    const sciIds = userScis.map(sci => sci.sciId);

    // Construire la requête de base
    let whereClause = {
      OR: [
        { sciId: { in: sciIds } },
        {
          property: {
            sciId: { in: sciIds }
          }
        },
        {
          tenant: {
            properties: {
              some: {
                property: {
                  sciId: { in: sciIds }
                }
              }
            }
          }
        }
      ]
    };

    // Ajouter les filtres si présents
    if (category) whereClause.category = category;
    if (type) whereClause.type = type;
    if (entityId) {
      switch (category) {
        case 'sci':
          whereClause.sciId = entityId;
          break;
        case 'property':
          whereClause.propertyId = entityId;
          break;
        case 'tenant':
          whereClause.tenantId = entityId;
          break;
      }
    }

    const documents = await prisma.document.findMany({
      where: whereClause,
      include: {
        sci: {
          select: {
            id: true,
            name: true
          }
        },
        property: {
          select: {
            id: true,
            address: true,
            type: true
          }
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Erreur GET /api/documents:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des documents' },
      { status: 500 }
    );
  }
}

// POST /api/documents - Créer un nouveau document
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();
    const {
      name,
      type,
      category,
      url,
      expiryDate,
      sciId,
      propertyId,
      tenantId
    } = data;

    // Validation des données requises
    if (!name || !type || !category || !url) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Vérifier l'accès selon la catégorie
    let hasAccess = false;
    switch (category) {
      case 'sci':
        if (!sciId) {
          return NextResponse.json(
            { error: 'ID de SCI manquant' },
            { status: 400 }
          );
        }
        const sciAccess = await prisma.userOnSCI.findFirst({
          where: {
            sciId,
            userId: session.user.id,
            role: {
              in: ['owner', 'admin']
            }
          }
        });
        hasAccess = !!sciAccess;
        break;

      case 'property':
        if (!propertyId) {
          return NextResponse.json(
            { error: 'ID de bien manquant' },
            { status: 400 }
          );
        }
        const property = await prisma.property.findUnique({
          where: { id: propertyId },
          include: {
            sci: {
              include: {
                users: {
                  where: {
                    userId: session.user.id,
                    role: {
                      in: ['owner', 'admin']
                    }
                  }
                }
              }
            }
          }
        });
        hasAccess = property?.sci.users.length > 0;
        break;

      case 'tenant':
        if (!tenantId) {
          return NextResponse.json(
            { error: 'ID de locataire manquant' },
            { status: 400 }
          );
        }
        const tenant = await prisma.tenant.findUnique({
          where: { id: tenantId },
          include: {
            properties: {
              include: {
                property: {
                  include: {
                    sci: {
                      include: {
                        users: {
                          where: {
                            userId: session.user.id,
                            role: {
                              in: ['owner', 'admin']
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        });
        hasAccess = tenant?.properties.some(p => p.property.sci.users.length > 0);
        break;

      default:
        return NextResponse.json(
          { error: 'Catégorie invalide' },
          { status: 400 }
        );
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Droits insuffisants' },
        { status: 403 }
      );
    }

    // Créer le document
    const document = await prisma.document.create({
      data: {
        name,
        type,
        category,
        url,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        sciId,
        propertyId,
        tenantId
      },
      include: {
        sci: {
          select: {
            id: true,
            name: true
          }
        },
        property: {
          select: {
            id: true,
            address: true
          }
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /api/documents:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du document' },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Supprimer un document
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const documentId = params.id;

    // Récupérer le document avec ses relations
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        sci: {
          include: {
            users: {
              where: {
                userId: session.user.id,
                role: {
                  in: ['owner', 'admin']
                }
              }
            }
          }
        },
        property: {
          include: {
            sci: {
              include: {
                users: {
                  where: {
                    userId: session.user.id,
                    role: {
                      in: ['owner', 'admin']
                    }
                  }
                }
              }
            }
          }
        },
        tenant: {
          include: {
            properties: {
              include: {
                property: {
                  include: {
                    sci: {
                      include: {
                        users: {
                          where: {
                            userId: session.user.id,
                            role: {
                              in: ['owner', 'admin']
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // Vérifier les droits d'accès
    const hasAccess = 
      (document?.sci?.users.length > 0) ||
      (document?.property?.sci.users.length > 0) ||
      (document?.tenant?.properties.some(p => p.property.sci.users.length > 0));

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Droits insuffisants' },
        { status: 403 }
      );
    }

    // Supprimer le document
    await prisma.document.delete({
      where: { id: documentId }
    });

    return NextResponse.json(
      { message: 'Document supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur DELETE /api/documents:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du document' },
      { status: 500 }
    );
  }
}
