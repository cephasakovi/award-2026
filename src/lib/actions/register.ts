"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function go(message: string) {
  redirect(`/login?message=${encodeURIComponent(message)}`);
}

export async function registerAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !email.includes("@")) {
    go("Email invalide.");
  }

  // ✅ Domain restriction: only @lomebs.com
  if (!email.endsWith("@lomebs.com")) {
    go("Désolé, seuls les emails @lomebs.com sont autorisés à voter. Veuillez vous connecter avec votre mail LBS.");
  }

  if (password.length < 6) {
    go("Le mot de passe doit contenir au moins 6 caracteres.");
  }

  if (password !== confirmPassword) {
    go("Les mots de passe ne correspondent pas.");
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    go("Cet email est deja utilise.");
  }

  const hashed = await bcrypt.hash(password, 10);

  const isAdmin = email === "admin@lomebs.com" || email.startsWith("admin@");
  const role = isAdmin ? "ADMIN" : "STUDENT";

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      role,
    },
  });

  go(isAdmin ? "Compte Administrateur créé avec succès. Vous pouvez vous connecter." : "Compte créé avec succès. Vous pouvez voter.");
}
