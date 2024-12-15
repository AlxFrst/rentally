import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/sci - Récupérer toutes les SCI accessibles par l'utilisateur
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const scis = await prisma.sCI.findMany({
      where: {
        users: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        associates: true,
        properties: {
          select: {
            id: true,
            address: true,
            type: true,
            status: true
          }
        },
        _count: {
          select: {
            documents: true
          }
        }
      }
    });

    return NextResponse.json(scis);
  } catch (error) {
    console.error('Erreur GET /api/sci:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des SCI' },
      { status: 500 }
    );
  }
}

// POST /api/sci - Créer une nouvelle SCI
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();
    const {
      name,
      address,
      sirenNumber,
      creationDate,
      socialCapital,
      mainContact,
      email,
      phone,
      associates
    } = data;

    // Validation des données requises
    if (!name || !address || !sirenNumber || !creationDate || !socialCapital) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Vérifier si le SIREN existe déjà
    const existingSCI = await prisma.sCI.findUnique({
      where: { sirenNumber }
    });

    if (existingSCI) {
      return NextResponse.json(
        { error: 'Une SCI avec ce numéro SIREN existe déjà' },
        { status: 400 }
      );
    }

    // Créer la SCI avec ses associés dans une transaction
    const sci = await prisma.$transaction(async (tx) => {
      // Créer la SCI
      const newSCI = await tx.sCI.create({
        data: {
          name,
          address,
          sirenNumber,
          creationDate: new Date(creationDate),
          socialCapital,
          mainContact,
          email,
          phone,
          users: {
            create: {
              userId: session.user.id,
              role: 'owner'
            }
          }
        }
      });

      // Ajouter les associés si fournis
      if (associates && associates.length > 0) {
        await tx.associate.createMany({
          data: associates.map(associate => ({
            name: associate.name,
            percentage: associate.percentage,
            sciId: newSCI.id
          }))
        });
      }

      return newSCI;
    });

    return NextResponse.json(sci, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /api/sci:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la SCI' },
      { status: 500 }
    );
  }
}

// PATCH /api/sci/[id] - Mettre à jour une SCI
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();
    const sciId = params.id;

    // Vérifier les droits d'accès
    const userAccess = await prisma.userOnSCI.findFirst({
      where: {
        sciId,
        userId: session.user.id,
        role: {
          in: ['owner', 'admin']
        }
      }
    });

    if (!userAccess) {
      return NextResponse.json(
        { error: 'Droits insuffisants' },
        { status: 403 }
      );
    }

    // Mettre à jour la SCI
    const updatedSCI = await prisma.sCI.update({
      where: { id: sciId },
      data: {
        name: data.name,
        address: data.address,
        mainContact: data.mainContact,
        email: data.email,
        phone: data.phone,
        socialCapital: data.socialCapital
      }
    });

    return NextResponse.json(updatedSCI);
  } catch (error) {
    console.error('Erreur PATCH /api/sci:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la SCI' },
      { status: 500 }
    );
  }
}

// DELETE /api/sci/[id] - Supprimer une SCI
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const sciId = params.id;

    // Vérifier les droits d'accès (seul le propriétaire peut supprimer)
    const userAccess = await prisma.userOnSCI.findFirst({
      where: {
        sciId,
        userId: session.user.id,
        role: 'owner'
      }
    });

    if (!userAccess) {
      return NextResponse.json(
        { error: 'Droits insuffisants' },
        { status: 403 }
      );
    }

    // Supprimer la SCI (les relations seront supprimées automatiquement grâce aux cascades)
    await prisma.sCI.delete({
      where: { id: sciId }
    });

    return NextResponse.json(
      { message: 'SCI supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur DELETE /api/sci:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la SCI' },
      { status: 500 }
    );
  }
}
