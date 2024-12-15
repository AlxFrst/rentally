import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/properties - Récupérer tous les biens accessibles par l'utilisateur
export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer toutes les propriétés accessibles par l'utilisateur
    const properties = await prisma.property.findMany({
      where: {
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
      },
      include: {
        sci: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tenants: {
          include: {
            tenant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          },
          where: {
            active: true
          }
        },
        _count: {
          select: {
            documents: true
          }
        }
      }
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Erreur lors de la récupération des biens:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/properties - Créer un nouveau bien
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();

    // Par défaut, on lie la propriété à l'utilisateur
    const propertyData = {
      address: data.address,
      type: data.type,
      surface: parseFloat(data.surface),
      rooms: parseInt(data.rooms),
      floor: data.floor ? parseInt(data.floor) : null,
      buildYear: parseInt(data.buildYear),
      hasElevator: Boolean(data.hasElevator),
      hasParking: Boolean(data.hasParking),
      hasBasement: Boolean(data.hasBasement),
      heatingType: data.heatingType,
      status: data.status || 'vacant',
      userId: session.user.id
    };

    // Si une SCI est spécifiée, on vérifie l'accès et on met à jour les relations
    if (data.sciId) {
      const userSci = await prisma.userOnSCI.findFirst({
        where: {
          userId: session.user.id,
          sciId: data.sciId
        }
      });

      if (!userSci) {
        return NextResponse.json({ error: 'Non autorisé pour cette SCI' }, { status: 403 });
      }

      // Si la propriété est liée à une SCI, on retire la liaison avec l'utilisateur
      propertyData.userId = null;
      propertyData.sciId = data.sciId;
    }

    // Créer le bien
    const property = await prisma.property.create({
      data: propertyData,
      include: {
        sci: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Erreur lors de la création du bien:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PATCH /api/properties/[id] - Mettre à jour un bien
export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Vérifier que le bien existe et que l'utilisateur y a accès
    const property = await prisma.property.findFirst({
      where: {
        id,
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
    });

    if (!property) {
      return NextResponse.json({ error: 'Bien non trouvé ou accès non autorisé' }, { status: 404 });
    }

    // Si on change la SCI, vérifier que l'utilisateur a accès à la nouvelle SCI
    if (data.sciId && data.sciId !== property.sciId) {
      const userSci = await prisma.userOnSCI.findFirst({
        where: {
          userId: session.user.id,
          sciId: data.sciId
        }
      });

      if (!userSci) {
        return NextResponse.json({ error: 'Non autorisé pour cette SCI' }, { status: 403 });
      }
    }

    // Mettre à jour le bien
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        address: data.address,
        type: data.type,
        surface: parseFloat(data.surface),
        rooms: parseInt(data.rooms),
        floor: data.floor ? parseInt(data.floor) : null,
        buildYear: parseInt(data.buildYear),
        hasElevator: Boolean(data.hasElevator),
        hasParking: Boolean(data.hasParking),
        hasBasement: Boolean(data.hasBasement),
        heatingType: data.heatingType,
        status: data.status,
        // Si une SCI est spécifiée, on lie la propriété à la SCI, sinon à l'utilisateur
        userId: data.sciId ? null : session.user.id,
        sciId: data.sciId || null
      },
      include: {
        sci: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du bien:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE /api/properties/[id] - Supprimer un bien
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Vérifier que le bien existe et que l'utilisateur y a accès
    const property = await prisma.property.findFirst({
      where: {
        id,
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
    });

    if (!property) {
      return NextResponse.json({ error: 'Bien non trouvé ou accès non autorisé' }, { status: 404 });
    }

    // Supprimer le bien
    await prisma.property.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du bien:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
