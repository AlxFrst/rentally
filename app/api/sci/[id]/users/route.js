import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/sci/[id]/users - Récupérer tous les utilisateurs d'une SCI
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const sciId = params.id;

    // Vérifier l'accès à la SCI
    const userAccess = await prisma.userOnSCI.findFirst({
      where: {
        sciId,
        userId: session.user.id
      }
    });

    if (!userAccess) {
      return NextResponse.json(
        { error: 'Accès non autorisé à cette SCI' },
        { status: 403 }
      );
    }

    // Récupérer tous les utilisateurs de la SCI
    const users = await prisma.userOnSCI.findMany({
      where: { sciId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Erreur GET /api/sci/[id]/users:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}

// POST /api/sci/[id]/users - Ajouter un utilisateur à une SCI
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const sciId = params.id;
    const { email, role } = await request.json();

    // Vérifier que l'utilisateur actuel est propriétaire ou admin
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

    // Vérifier que l'utilisateur à ajouter existe
    const userToAdd = await prisma.user.findUnique({
      where: { email }
    });

    if (!userToAdd) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur n'est pas déjà membre
    const existingMember = await prisma.userOnSCI.findFirst({
      where: {
        sciId,
        userId: userToAdd.id
      }
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'L\'utilisateur est déjà membre de cette SCI' },
        { status: 400 }
      );
    }

    // Ajouter l'utilisateur à la SCI
    const newMember = await prisma.userOnSCI.create({
      data: {
        sciId,
        userId: userToAdd.id,
        role
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /api/sci/[id]/users:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// PATCH /api/sci/[id]/users/[userId] - Modifier le rôle d'un utilisateur
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id: sciId, userId } = params;
    const { role } = await request.json();

    // Vérifier que l'utilisateur actuel est propriétaire
    const userAccess = await prisma.userOnSCI.findFirst({
      where: {
        sciId,
        userId: session.user.id,
        role: 'owner'
      }
    });

    if (!userAccess) {
      return NextResponse.json(
        { error: 'Seul le propriétaire peut modifier les rôles' },
        { status: 403 }
      );
    }

    // Mettre à jour le rôle
    const updatedMember = await prisma.userOnSCI.update({
      where: {
        userId_sciId: {
          userId,
          sciId
        }
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Erreur PATCH /api/sci/[id]/users/[userId]:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification du rôle' },
      { status: 500 }
    );
  }
}

// DELETE /api/sci/[id]/users/[userId] - Retirer un utilisateur d'une SCI
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id: sciId, userId } = params;

    // Vérifier que l'utilisateur actuel est propriétaire ou l'utilisateur lui-même
    const userAccess = await prisma.userOnSCI.findFirst({
      where: {
        sciId,
        userId: session.user.id,
        OR: [
          { role: 'owner' },
          { userId: session.user.id }
        ]
      }
    });

    if (!userAccess) {
      return NextResponse.json(
        { error: 'Droits insuffisants' },
        { status: 403 }
      );
    }

    // Empêcher la suppression du propriétaire
    const memberToRemove = await prisma.userOnSCI.findFirst({
      where: {
        sciId,
        userId
      }
    });

    if (memberToRemove?.role === 'owner') {
      return NextResponse.json(
        { error: 'Impossible de retirer le propriétaire' },
        { status: 400 }
      );
    }

    // Retirer l'utilisateur
    await prisma.userOnSCI.delete({
      where: {
        userId_sciId: {
          userId,
          sciId
        }
      }
    });

    return NextResponse.json(
      { message: 'Utilisateur retiré avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur DELETE /api/sci/[id]/users/[userId]:', error);
    return NextResponse.json(
      { error: 'Erreur lors du retrait de l\'utilisateur' },
      { status: 500 }
    );
  }
}
