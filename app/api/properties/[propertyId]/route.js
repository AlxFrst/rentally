import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/properties/[propertyId] - Récupérer un bien spécifique
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { propertyId } = params;

    // Vérifier que l'utilisateur a accès à cette propriété
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
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

    if (!property) {
      return NextResponse.json({ error: 'Propriété non trouvée' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Erreur lors de la récupération du bien:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
