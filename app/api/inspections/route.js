import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

const prisma = new PrismaClient();

// GET /api/inspections - Récupérer tous les états des lieux accessibles
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    // Récupérer les SCI auxquelles l'utilisateur a accès
    const userScis = await prisma.userOnSCI.findMany({
      where: { userId: session.user.id },
      select: { sciId: true }
    });

    const sciIds = userScis.map(sci => sci.sciId);

    // Construire la requête
    let whereClause = {
      property: {
        sciId: {
          in: sciIds
        }
      }
    };

    if (propertyId) whereClause.propertyId = propertyId;
    if (type) whereClause.type = type;
    if (status) whereClause.status = status;

    const inspections = await prisma.inspection.findMany({
      where: whereClause,
      include: {
        property: {
          select: {
            id: true,
            address: true,
            type: true,
            sci: {
              select: {
                id: true,
                name: true
              }
            },
            tenants: {
              where: {
                active: true
              },
              include: {
                tenant: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(inspections);
  } catch (error) {
    console.error('Erreur GET /api/inspections:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des états des lieux' },
      { status: 500 }
    );
  }
}

// POST /api/inspections - Créer un nouvel état des lieux
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();
    const {
      type,
      date,
      notes,
      photos,
      propertyId,
      generateLink
    } = data;

    // Validation des données requises
    if (!type || !date || !propertyId) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Vérifier l'accès au bien
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

    if (!property || !property.sci.users.length) {
      return NextResponse.json(
        { error: 'Droits insuffisants' },
        { status: 403 }
      );
    }

    // Générer un lien éphémère si demandé
    let ephemeralLink = null;
    let linkExpiry = null;
    if (generateLink) {
      ephemeralLink = crypto.randomBytes(32).toString('hex');
      linkExpiry = new Date();
      linkExpiry.setDate(linkExpiry.getDate() + 7); // Lien valide 7 jours
    }

    // Créer l'état des lieux
    const inspection = await prisma.inspection.create({
      data: {
        type,
        date: new Date(date),
        notes: notes || '',
        photos: photos ? JSON.stringify(photos) : '[]',
        status: 'draft',
        propertyId,
        ephemeralLink,
        linkExpiry
      },
      include: {
        property: {
          select: {
            id: true,
            address: true,
            type: true,
            sci: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(inspection, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /api/inspections:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'état des lieux' },
      { status: 500 }
    );
  }
}

// PATCH /api/inspections/[id] - Mettre à jour un état des lieux
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const inspectionId = params.id;
    const data = await request.json();

    // Vérifier l'accès à l'état des lieux
    const inspection = await prisma.inspection.findUnique({
      where: { id: inspectionId },
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
    });

    if (!inspection || !inspection.property.sci.users.length) {
      return NextResponse.json(
        { error: 'Droits insuffisants' },
        { status: 403 }
      );
    }

    // Empêcher la modification si l'état des lieux est complété
    if (inspection.status === 'completed') {
      return NextResponse.json(
        { error: 'Impossible de modifier un état des lieux complété' },
        { status: 400 }
      );
    }

    // Mettre à jour l'état des lieux
    const updatedInspection = await prisma.inspection.update({
      where: { id: inspectionId },
      data: {
        notes: data.notes,
        photos: data.photos ? JSON.stringify(data.photos) : undefined,
        status: data.status,
        date: data.date ? new Date(data.date) : undefined
      },
      include: {
        property: {
          select: {
            id: true,
            address: true,
            type: true,
            sci: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(updatedInspection);
  } catch (error) {
    console.error('Erreur PATCH /api/inspections:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'état des lieux' },
      { status: 500 }
    );
  }
}

// DELETE /api/inspections/[id] - Supprimer un état des lieux
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const inspectionId = params.id;

    // Vérifier l'accès à l'état des lieux
    const inspection = await prisma.inspection.findUnique({
      where: { id: inspectionId },
      include: {
        property: {
          include: {
            sci: {
              include: {
                users: {
                  where: {
                    userId: session.user.id,
                    role: 'owner'
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!inspection || !inspection.property.sci.users.length) {
      return NextResponse.json(
        { error: 'Droits insuffisants' },
        { status: 403 }
      );
    }

    // Empêcher la suppression si l'état des lieux est complété
    if (inspection.status === 'completed') {
      return NextResponse.json(
        { error: 'Impossible de supprimer un état des lieux complété' },
        { status: 400 }
      );
    }

    // Supprimer l'état des lieux
    await prisma.inspection.delete({
      where: { id: inspectionId }
    });

    return NextResponse.json(
      { message: 'État des lieux supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur DELETE /api/inspections:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'état des lieux' },
      { status: 500 }
    );
  }
}
