import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/tenants/[tenantId] - Récupérer un locataire spécifique
export async function GET(request, context) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const tenantId = context.params.tenantId;

    const tenant = await prisma.tenant.findFirst({
      where: {
        id: tenantId,
        OR: [
          { userId: session.user.id },
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
          }
        ]
      },
      include: {
        properties: {
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
        },
        documents: {
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
            expiryDate: true,
            createdAt: true
          }
        }
      }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Locataire non trouvé' }, { status: 404 });
    }

    return NextResponse.json(tenant);
  } catch (error) {
    console.error('Erreur lors de la récupération du locataire:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
