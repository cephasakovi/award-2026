"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || role !== "ADMIN") {
    redirect("/login");
  }

  return session;
}

function redirectWithMessage(message: string) {
  redirect(`/admin?message=${encodeURIComponent(message)}`);
}

async function saveUploadedPhoto(file: File | null | undefined) {
  if (!file || file.size === 0) {
    return null;
  }

  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!file.type || !allowedTypes.has(file.type)) {
    throw new Error("Format de photo non autorisé. Utilisez JPG, PNG ou WEBP.");
  }
  const maxSizeBytes = 4 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error("Image trop lourde. Taille maximale: 4 MB.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");

  return `data:${file.type};base64,${base64}`;
}

export async function createCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();

  if (!name) {
    redirectWithMessage("Le nom de la categorie est obligatoire.");
  }

  const slug = slugify(slugInput || name);

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
      },
    });
  } catch {
    redirectWithMessage("Cette categorie existe deja ou le slug est invalide.");
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/results");
  redirectWithMessage("Categorie creee avec succes.");
}

export async function updateCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();

  if (!id) {
    redirectWithMessage("Categorie introuvable.");
  }

  if (!name) {
    redirectWithMessage("Le nom de la categorie est obligatoire.");
  }

  const slug = slugify(slugInput || name);

  try {
    await prisma.category.update({
      where: { id },
      data: { name, slug },
    });
  } catch {
    redirectWithMessage("Impossible de modifier cette categorie.");
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/results");
  redirectWithMessage("Categorie modifiee avec succes.");
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirectWithMessage("Categorie introuvable.");
  }

  try {
    await prisma.category.delete({
      where: { id },
    });
  } catch {
    redirectWithMessage("Impossible de supprimer cette categorie.");
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/results");
  redirectWithMessage("Categorie supprimee avec succes.");
}

export async function createNomineeAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const photo = formData.get("photo");

  if (!categoryId) {
    redirectWithMessage("Choisis une categorie.");
  }

  if (!name) {
    redirectWithMessage("Le nom du nomine est obligatoire.");
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    redirectWithMessage("Categorie introuvable.");
    return;
  }

  try {
    const photoPath = await saveUploadedPhoto(photo instanceof File ? photo : null);

    await prisma.nominee.create({
      data: {
        name,
        description: description || category.name,
        photo: photoPath,
        categoryId,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Impossible d'ajouter le nomine.";
    redirectWithMessage(message);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/results");
  redirectWithMessage("Nomine ajoute avec succes.");
}

export async function updateNomineeAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const photo = formData.get("photo");

  if (!id) {
    redirectWithMessage("Nomine introuvable.");
  }

  if (!categoryId) {
    redirectWithMessage("Choisis une categorie.");
  }

  if (!name) {
    redirectWithMessage("Le nom du nomine est obligatoire.");
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    redirectWithMessage("Categorie introuvable.");
    return;
  }

  const nominee = await prisma.nominee.findUnique({
    where: { id },
  });

  if (!nominee) {
    redirectWithMessage("Nomine introuvable.");
    return;
  }

  try {
    const photoPath = await saveUploadedPhoto(photo instanceof File ? photo : null);

    await prisma.nominee.update({
      where: { id },
      data: {
        name,
        description: description || category.name,
        categoryId,
        ...(photoPath ? { photo: photoPath } : {}),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Impossible de modifier le nomine.";
    redirectWithMessage(message);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/results");
  redirectWithMessage("Nomine modifie avec succes.");
}

export async function deleteNomineeAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirectWithMessage("Nomine introuvable.");
  }

  try {
    await prisma.nominee.delete({
      where: { id },
    });
  } catch {
    redirectWithMessage("Impossible de supprimer ce nomine.");
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/results");
  redirectWithMessage("Nomine supprime avec succes.");
}
