import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ResultsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || role !== "ADMIN") {
    redirect("/");
  }

  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      nominees: {
        orderBy: { createdAt: "asc" },
        include: {
          _count: {
            select: { votes: true },
          },
        },
      },
    },
  });

  const totalVotes = categories.reduce((sum, category) => {
    return (
      sum +
      category.nominees.reduce((categorySum, nominee) => categorySum + nominee._count.votes, 0)
    );
  }, 0);

  return (
    <main className="min-h-screen bg-black text-ivory">
      <section className="border-b border-gold/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-[10px] uppercase tracking-[0.45em] text-gold/60">Résultats</p>
          <h1 className="mt-4 font-serif text-5xl md:text-7xl">Classement des nominés</h1>
          <p className="mt-4 max-w-2xl text-sm text-ivory/60">
            Le compteur affiche les votes enregistrés par catégorie.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.3em] text-gold/70">
            <a href="/" className="rounded-full border border-gold/20 px-4 py-2 hover:bg-gold hover:text-black">
              Accueil
            </a>
            <a href="/login" className="rounded-full border border-gold/20 px-4 py-2 hover:bg-gold hover:text-black">
              Connexion
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gold/10 bg-white/[0.03] p-6">
            <div className="text-[10px] uppercase tracking-[0.35em] text-gold/60">Categories</div>
            <div className="mt-3 font-serif text-5xl">{categories.length}</div>
          </div>
          <div className="rounded-2xl border border-gold/10 bg-white/[0.03] p-6">
            <div className="text-[10px] uppercase tracking-[0.35em] text-gold/60">Votes</div>
            <div className="mt-3 font-serif text-5xl">{totalVotes}</div>
          </div>
          <div className="rounded-2xl border border-gold/10 bg-white/[0.03] p-6">
            <div className="text-[10px] uppercase tracking-[0.35em] text-gold/60">Etat</div>
            <div className="mt-3 text-lg text-ivory">Temps reel depuis la base</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryTotal = category.nominees.reduce((sum, nominee) => sum + nominee._count.votes, 0);
            const winner = [...category.nominees].sort((a, b) => b._count.votes - a._count.votes)[0];

            return (
              <article key={category.id} className="rounded-3xl border border-gold/10 bg-white/[0.03] p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-gold/60">Categorie</p>
                    <h2 className="mt-2 font-serif text-3xl md:text-4xl">{category.name}</h2>
                  </div>
                  <div className="text-sm text-ivory/50">
                    {categoryTotal} vote(s) dans cette categorie
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  {category.nominees.map((nominee) => {
                    const percent = categoryTotal > 0 ? Math.round((nominee._count.votes / categoryTotal) * 100) : 0;
                    const isLeader = winner?.id === nominee.id && categoryTotal > 0;

                    return (
                      <div key={nominee.id} className="rounded-2xl border border-ivory/10 bg-black/30 p-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-serif text-2xl">{nominee.name}</h3>
                              {isLeader ? (
                                <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-gold">
                                  Leader
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-2 text-sm text-ivory/50">{nominee.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-serif text-4xl text-gold">{nominee._count.votes}</div>
                            <div className="text-[10px] uppercase tracking-[0.3em] text-ivory/35">{percent}%</div>
                          </div>
                        </div>
                        <div className="mt-4 h-2 rounded-full bg-white/5">
                          <div
                            className="h-2 rounded-full bg-gold transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
