"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function voteAction(formData: FormData) {
  const nomineeId = String(formData.get("nomineeId") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();

  if (!nomineeId || !categoryId) {
    return { error: "Données manquantes" };
  }

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { error: "Vous devez être connecté pour voter" };
  }

  if (!session.user.email || !session.user.email.endsWith("@lomebs.com")) {
    return { error: "Désolé, seuls les emails @lomebs.com sont autorisés à voter. Veuillez vous connecter avec votre mail LBS." };
  }

  const userId = session.user.id;

  if (!userId) {
    return { error: "Session invalide" };
  }
  try {
    // Check if user already voted in this category
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_categoryId: {
          userId,
          categoryId,
        },
      },
    });

    if (existingVote) {
      return { error: "Vous avez déjà voté dans cette catégorie" };
    }

    // Create the vote
    await prisma.vote.create({
      data: {
        userId,
        nomineeId,
        categoryId,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erreur de vote:", error);
    return { error: "Une erreur est survenue lors de l'enregistrement du vote" };
  }
}
