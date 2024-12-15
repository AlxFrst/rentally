import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/properties/[propertyId]/tenants - Assigner un locataire à une propriété
export async function POST(request, context) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const propertyId = context.params.propertyId;
    const { tenantId } = await request.json();

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
    });

    if (!property) {
      return NextResponse.json({ error: 'Propriété non trouvée ou accès non autorisé' }, { status: 404 });
    }

    // Vérifier si le locataire existe
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Locataire non trouvé' }, { status: 404 });
    }

    // Désactiver les anciennes relations actives
    await prisma.tenantsOnProperties.updateMany({
      where: {
        propertyId: propertyId,
        active: true
      },
      data: {
        active: false,
        endDate: new Date()
      }
    });

    // Créer la nouvelle relation
    const propertyTenant = await prisma.tenantsOnProperties.create({
      data: {
        propertyId: propertyId,
        tenantId: tenantId,
        startDate: new Date(),
        active: true,
        rentAmount: 0, // À définir par l'utilisateur plus tard
        depositAmount: 0 // À définir par l'utilisateur plus tard
      }
    });

    // Mettre à jour le statut de la propriété
    await prisma.property.update({
      where: { id: propertyId },
      data: { status: 'rented' }
    });

    return NextResponse.json(propertyTenant);
  } catch (error) {
    console.error('Erreur lors de l\'assignation du locataire:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
