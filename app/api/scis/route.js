import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/scis - Récupérer toutes les SCIs accessibles par l'utilisateur
export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer les SCIs auxquelles l'utilisateur a accès
    const userScis = await prisma.userOnSCI.findMany({
      where: { userId: session.user.id },
      include: {
        sci: {
          select: {
            id: true,
            name: true,
            address: true,
            sirenNumber: true,
            socialCapital: true,
            mainContact: true,
            email: true,
            phone: true,
            properties: {
              select: {
                id: true,
                address: true,
                type: true,
                surface: true,
                rooms: true,
                floor: true,
                buildYear: true,
                hasElevator: true,
                hasParking: true,
                hasBasement: true,
                heatingType: true,
                status: true,
                tenants: {
                  where: { active: true },
                  include: {
                    tenant: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
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

    // Transformer les données pour n'avoir que les SCIs
    const scis = userScis.map(userSci => userSci.sci);

    return NextResponse.json(scis);
  } catch (error) {
    console.error('Erreur lors de la récupération des SCIs:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/scis - Créer une nouvelle SCI
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();

    // Créer la SCI et la relation avec l'utilisateur en une seule transaction
    const sci = await prisma.$transaction(async (prisma) => {
      // Créer la SCI
      const newSci = await prisma.sCI.create({
        data: {
          name: data.name,
          address: data.address,
          sirenNumber: data.sirenNumber,
          creationDate: new Date(data.creationDate),
          socialCapital: parseFloat(data.socialCapital),
          mainContact: data.mainContact,
          email: data.email,
          phone: data.phone,
          users: {
            create: {
              userId: session.user.id,
              role: 'ADMIN'
            }
          }
        }
      });

      return newSci;
    });

    return NextResponse.json(sci);
  } catch (error) {
    console.error('Erreur lors de la création de la SCI:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PATCH /api/scis/[id] - Mettre à jour une SCI
export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Vérifier que l'utilisateur a accès à la SCI
    const userSci = await prisma.userOnSCI.findFirst({
      where: {
        sciId: id,
        userId: session.user.id,
        role: 'ADMIN'
      }
    });

    if (!userSci) {
      return NextResponse.json({ error: 'Non autorisé pour cette SCI' }, { status: 403 });
    }

    // Mettre à jour la SCI
    const sci = await prisma.sCI.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        sirenNumber: data.sirenNumber,
        socialCapital: parseFloat(data.socialCapital),
        mainContact: data.mainContact,
        email: data.email,
        phone: data.phone
      }
    });

    return NextResponse.json(sci);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la SCI:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE /api/scis/[id] - Supprimer une SCI
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Vérifier que l'utilisateur a accès à la SCI et est admin
    const userSci = await prisma.userOnSCI.findFirst({
      where: {
        sciId: id,
        userId: session.user.id,
        role: 'ADMIN'
      }
    });

    if (!userSci) {
      return NextResponse.json({ error: 'Non autorisé pour cette SCI' }, { status: 403 });
    }

    // Supprimer la SCI
    await prisma.sCI.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de la SCI:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
