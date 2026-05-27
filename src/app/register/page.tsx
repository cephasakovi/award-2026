"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { registerAction } from "@/lib/actions/register";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-ivory/[0.02] border border-ivory/10 p-12 backdrop-blur-xl rounded-sm">
          <div className="flex flex-col items-center mb-10">
            <Image
              src="/awards-logo-transparent.png"
              alt="Logo"
              width={140}
              height={60}
              className="mb-8 opacity-80"
            />
            <div className="font-signature text-3xl text-gold mb-2">Inscription</div>
            <p className="text-ivory/40 text-[10px] uppercase tracking-[0.2em] text-center">
              Cree un compte pour voter
            </p>
          </div>

          <form action={registerAction} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-ivory/60 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-white/5 border border-ivory/10 px-4 py-3 text-ivory focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-ivory/60 mb-2">Mot de passe</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full bg-white/5 border border-ivory/10 px-4 py-3 text-ivory focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-ivory/60 mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                className="w-full bg-white/5 border border-ivory/10 px-4 py-3 text-ivory focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gold hover:bg-gold/80 text-black font-bold py-6 rounded-none tracking-[0.2em] uppercase transition-all"
            >
              Créer le compte
            </button>
          </form>

          <div className="mt-8 text-center">
            <a
              href="/login"
              className="text-ivory/20 hover:text-gold text-[10px] uppercase tracking-[0.2em] transition-colors"
            >
              Déjà un compte ? Connexion
            </a>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
