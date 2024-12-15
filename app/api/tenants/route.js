import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/tenants - Récupérer tous les locataires accessibles par l'utilisateur
export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer tous les locataires accessibles par l'utilisateur
    const tenants = await prisma.tenant.findMany({
      where: {
        OR: [
          // Locataires des propriétés de l'utilisateur
          {
            properties: {
              some: {
                property: {
                  OR: [
                    { userId: session.user.id },
                    {
                      sci: {
                        users: {
                          some: {
                            userId: session.user.id
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          // Locataires créés par l'utilisateur
          { userId: session.user.id }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        properties: {
          where: {
            active: true
          },
          include: {
            property: {
              select: {
                id: true,
                address: true
              }
            }
          }
        },
        documents: {
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
            expiryDate: true
          }
        }
      }
    });

    return NextResponse.json(tenants);
  } catch (error) {
    console.error('Erreur GET /api/tenants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des locataires' },
      { status: 500 }
    );
  }
}

// POST /api/tenants - Créer un nouveau locataire
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();
    
    // Créer le locataire
    const tenant = await prisma.tenant.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: new Date(data.birthDate),
        email: data.email,
        phone: data.phone,
        previousAddress: data.previousAddress || null,
        salary: data.salary || 0,
        profession: data.occupation,
        userId: session.user.id
      },
      include: {
        properties: {
          include: {
            property: true
          }
        },
        documents: true
      }
    });

    return NextResponse.json(tenant);
  } catch (error) {
    console.error('Erreur POST /api/tenants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du locataire' },
      { status: 500 }
    );
  }
}

// PATCH /api/tenants/[id] - Mettre à jour un locataire
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const tenantId = params.id;
    const data = await request.json();

    // Vérifier l'accès au locataire via ses biens
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

    if (!tenant || !tenant.properties.some(p => p.property.sci.users.length > 0)) {
      return NextResponse.json(
        { error: 'Droits insuffisants' },
        { status: 403 }
      );
    }

    // Mettre à jour le locataire
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        salary: data.salary,
        profession: data.profession
      }
    });

    return NextResponse.json(updatedTenant);
  } catch (error) {
    console.error('Erreur PATCH /api/tenants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du locataire' },
      { status: 500 }
    );
  }
}

// DELETE /api/tenants/[id] - Supprimer un locataire
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const tenantId = params.id;

    // Vérifier l'accès au locataire
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
                        role: 'owner'
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

    if (!tenant || !tenant.properties.some(p => p.property.sci.users.length > 0)) {
      return NextResponse.json(
        { error: 'Droits insuffisants' },
        { status: 403 }
      );
    }

    // Vérifier si le locataire a des baux actifs
    const activeLeases = await prisma.tenantsOnProperties.findFirst({
      where: {
        tenantId,
        active: true
      }
    });

    if (activeLeases) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un locataire avec des baux actifs' },
        { status: 400 }
      );
    }

    // Supprimer le locataire
    await prisma.tenant.delete({
      where: { id: tenantId }
    });

    return NextResponse.json(
      { message: 'Locataire supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur DELETE /api/tenants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du locataire' },
      { status: 500 }
    );
  }
}
