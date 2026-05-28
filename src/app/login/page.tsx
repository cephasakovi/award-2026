"use client";

import { useState, Suspense } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const infoMessage = searchParams.get("message") ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail.endsWith("@lomebs.com")) {
        setError("Veuillez utiliser votre mail LBS (@lomebs.com).");
        setLoading(false);
        return;
      }

      const res = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Identifiants invalides");
      } else {
        const currentSession = await getSession();
        const role = (currentSession?.user as { role?: string } | undefined)?.role;
        router.push(role === "ADMIN" ? "/admin" : "/");
        router.refresh();
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ivory/[0.02] border border-ivory/10 p-12 backdrop-blur-xl rounded-sm">
      <div className="flex flex-col items-center mb-10">
        <Image
          src="/awards-logo-transparent.png"
          alt="Logo"
          width={140}
          height={60}
          className="mb-8 opacity-80"
        />
        <div className="font-signature text-3xl text-gold mb-2">Connexion</div>
        <p className="text-ivory/40 text-[10px] uppercase tracking-[0.2em] text-center">
          Accedez a votre espace de vote
        </p>
        <p className="mt-3 text-center text-[10px] text-gold/70">
          Connexion reservee aux comptes @lomebs.com
        </p>
      </div>

      {infoMessage ? (
        <div className="mb-6 rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">
          {infoMessage}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-ivory/60 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/5 border border-ivory/10 px-4 py-3 text-ivory focus:outline-none focus:border-gold/50 transition-colors"
            placeholder="votre@email.com"
            pattern="^[a-zA-Z0-9._%+-]+@lomebs\.com$"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-ivory/60 mb-2">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/5 border border-ivory/10 px-4 py-3 text-ivory focus:outline-none focus:border-gold/50 transition-colors" 
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-red-500 text-[10px] uppercase tracking-widest text-center">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gold hover:bg-gold/80 text-black font-bold py-6 rounded-none tracking-[0.2em] uppercase transition-all"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <a
          href="/register"
          className="block mb-3 text-ivory/40 hover:text-gold text-[10px] uppercase tracking-[0.2em] transition-colors"
        >
          Creer un compte
        </a>
        <a href="/" className="text-ivory/20 hover:text-gold text-[10px] uppercase tracking-[0.2em] transition-colors">
          Retour a la page d&apos;accueil
        </a>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <Suspense fallback={<div className="text-gold text-center">Chargement...</div>}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </main>
  );
}
