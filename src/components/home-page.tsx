"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import Hero from "@/components/ui/animated-shader-hero";
import Logo3D from "@/components/ui/logo-3d";
import IntroCinematic from "@/components/ui/intro-cinematic";
import InteractiveVoting from "@/components/ui/interactive-voting";
import { voteAction } from "@/lib/actions/vote";

type Category = {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  nominees: {
    id: string;
    name: string;
    description: string;
    score: number;
    photo?: string;
  }[];
};

const ceremonyDate = new Date("2026-06-13T20:00:00");

function getTimeLeft() {
  const now = new Date();
  const diff = ceremonyDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

export default function HomePage({ categories, initialVotes }: { categories: Category[]; initialVotes?: Record<string, string> }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [votes, setVotes] = useState<Record<string, string>>(initialVotes || {});
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loadingVote, setLoadingVote] = useState<string | null>(null);
  const userEmail = session?.user?.email?.toLowerCase() ?? "";
  const isLbsUser = userEmail.endsWith("@lomebs.com");

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleVote = async (categoryId: string, nomineeId: string) => {
    if (!session) {
      router.push("/login?message=" + encodeURIComponent("Veuillez vous connecter avec votre mail LBS (@lomebs.com) pour pouvoir voter."));
      return;
    }
    if (!isLbsUser) {
      alert("Seuls les utilisateurs avec un mail LBS (@lomebs.com) peuvent voter. Merci de vous connecter avec votre mail LBS.");
      return;
    }

    setLoadingVote(nomineeId);

    const formData = new FormData();
    formData.append("categoryId", categoryId);
    formData.append("nomineeId", nomineeId);

    const result = await voteAction(formData);

    if (result?.success) {
      setVotes((prev) => ({ ...prev, [categoryId]: nomineeId }));
    } else if (result?.error) {
      alert(result.error);
    }

    setLoadingVote(null);
  };

  return (
    <main className="min-h-screen text-ivory">
      <IntroCinematic />
      <header className="fixed top-0 z-40 w-full border-b border-ivory/5 bg-anthracite/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-2">
          <Image src="/awards-logo-transparent.png" alt="Awards" width={160} height={70} className="h-8 sm:h-10 w-auto object-contain opacity-80" />
          <nav className="flex items-center gap-3 sm:gap-10 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.3em] text-ivory/40">
            <a href="#vote" className="hover:text-gold transition-colors">Voter</a>
            {session ? (
              <div className="flex items-center gap-2 sm:gap-6">
                <span className="text-gold/60 hidden sm:inline max-w-[150px] truncate">{session.user?.email}</span>
                {(session.user as { role?: string } | undefined)?.role === "ADMIN" ? (
                  <a href="/admin" className="hover:text-gold transition-colors">Admin</a>
                ) : null}
                <button onClick={() => signOut()} className="hover:text-gold transition-colors">Déconnexion</button>
              </div>
            ) : (
              <a href="/login" className="hover:text-gold transition-colors">Connexion</a>
            )}
          </nav>
        </div>
      </header>

      {session && !isLbsUser ? (
        <div className="fixed top-[68px] sm:top-[74px] left-0 right-0 z-30 bg-red-950/80 border-y border-red-400/30 px-4 py-2 text-center text-xs text-red-100">
          Seuls les comptes @lomebs.com peuvent voter. Merci de vous reconnecter avec votre email LBS.
        </div>
      ) : null}

      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <Hero
          headline={{ line1: "Awards", line2: "LBS 2026" }}
          headlineElement={<Logo3D />}
          subtitle="Une celebration de l'excellence et du leadership."
          buttons={{
            primary: { text: "Participer au vote", onClick: () => document.getElementById("vote")?.scrollIntoView({ behavior: "smooth" }) }
          }}
        />

        <div className="relative z-10 mt-auto mb-20">
          <div className="flex flex-col items-center gap-8 px-4">
            <span className="font-signature text-3xl sm:text-4xl text-gold text-center">La ceremonie commence dans</span>
            <div className="grid grid-cols-4 gap-2 sm:gap-10">
              {[
                { label: "Jours", value: timeLeft.days },
                { label: "Hrs", value: timeLeft.hours },
                { label: "Min", value: timeLeft.minutes },
                { label: "Sec", value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center min-w-[65px] sm:min-w-[90px]">
                  <div className="font-serif text-3xl sm:text-5xl text-ivory">{String(item.value).padStart(2, "0")}</div>
                  <div className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-ivory/30 mt-2">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <InteractiveVoting
        categories={categories}
        votes={votes}
        handleVote={handleVote}
        loadingVote={loadingVote}
      />

      <footer className="py-24 border-t border-ivory/5 text-center">
        <div className="font-signature text-3xl text-gold mb-4 text-center">Awards LBS 2026</div>
        <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-ivory/20">
          <a href="/login" className="hover:text-gold transition-colors">Connexion</a>
        </div>
      </footer>
    </main>
  );
}
