import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();
  
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Récupérer les statistiques
    const [sciCount, propertyCount, tenantCount, documentCount] = await Promise.all([
      // Nombre de SCI
      prisma.sCI.count({
        where: {
          users: {
            some: {
              userId: session.user.id
            }
          }
        }
      }),
      // Nombre de propriétés
      prisma.property.count({
        where: {
          sci: {
            users: {
              some: {
                userId: session.user.id
              }
            }
          }
        }
      }),
      // Nombre de locataires actifs
      prisma.tenantsOnProperties.count({
        where: {
          active: true,
          property: {
            sci: {
              users: {
                some: {
                  userId: session.user.id
                }
              }
            }
          }
        }
      }),
      // Nombre de documents
      prisma.document.count({
        where: {
          OR: [
            {
              sci: {
                users: {
                  some: {
                    userId: session.user.id
                  }
                }
              }
            },
            {
              property: {
                sci: {
                  users: {
                    some: {
                      userId: session.user.id
                    }
                  }
                }
              }
            }
          ]
        }
      })
    ]);

    // Récupérer les alertes (documents expirant bientôt)
    const alerts = await prisma.document.findMany({
      where: {
        OR: [
          {
            sci: {
              users: {
                some: {
                  userId: session.user.id
                }
              }
            }
          },
          {
            property: {
              sci: {
                users: {
                  some: {
                    userId: session.user.id
                  }
                }
              }
            }
          }
        ],
        expiryDate: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
        }
      },
      select: {
        id: true,
        name: true,
        type: true,
        expiryDate: true,
        property: {
          select: {
            address: true
          }
        }
      }
    });

    // Récupérer les revenus mensuels (somme des loyers actifs)
    const monthlyIncome = await prisma.tenantsOnProperties.aggregate({
      where: {
        active: true,
        property: {
          sci: {
            users: {
              some: {
                userId: session.user.id
              }
            }
          }
        }
      },
      _sum: {
        rentAmount: true
      }
    });

    // Calculer le taux d'occupation
    const properties = await prisma.property.findMany({
      where: {
        sci: {
          users: {
            some: {
              userId: session.user.id
            }
          }
        }
      },
      include: {
        tenants: {
          where: {
            active: true
          }
        }
      }
    });

    const occupancyRate = properties.length > 0
      ? (properties.filter(p => p.tenants.length > 0).length / properties.length) * 100
      : 0;

    // Récupérer l'activité récente
    const recentActivity = await prisma.$queryRaw`
      SELECT 
        'NEW_TENANT' as type,
        t.firstName,
        t.lastName,
        p.address as propertyName,
        top.createdAt
      FROM TenantsOnProperties top
      JOIN Tenant t ON t.id = top.tenantId
      JOIN Property p ON p.id = top.propertyId
      JOIN SCI s ON s.id = p.sciId
      JOIN UserOnSCI us ON us.sciId = s.id
      WHERE us.userId = ${session.user.id}
      ORDER BY top.createdAt DESC
      LIMIT 5
    `;

    return NextResponse.json({
      stats: {
        sciCount,
        propertyCount,
        tenantCount,
        documentCount
      },
      alerts: alerts.map(alert => ({
        ...alert,
        propertyName: alert.property?.address || 'N/A'
      })),
      recentActivity,
      financialMetrics: {
        monthlyIncome: monthlyIncome._sum.rentAmount || 0,
        occupancyRate
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
