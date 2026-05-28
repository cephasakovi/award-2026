import Image from "next/image";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ExcelExport from "@/components/ui/excel-export";
import {
  createCategoryAction,
  createNomineeAction,
  deleteCategoryAction,
  deleteNomineeAction,
  updateCategoryAction,
  updateNomineeAction,
} from "@/lib/actions/admin";

type PageProps = {
  searchParams?: {
    message?: string;
  };
};

type CategoryRecord = Awaited<ReturnType<typeof prisma.category.findMany>>[number];
type NomineeRecord = Prisma.NomineeGetPayload<{ include: { category: true } }>;

export default async function AdminPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-black text-ivory flex items-center justify-center px-6">
        <div className="max-w-lg rounded-2xl border border-gold/15 bg-white/5 p-10 text-center backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold/70">Acces admin requis</p>
          <h1 className="mt-4 font-serif text-4xl text-ivory">Connexion admin</h1>
          <p className="mt-4 text-sm text-ivory/60">
            Connecte-toi avec un compte administrateur pour gerer les categories et les nomines.
          </p>
          <a
            href="/login"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-gold/30 px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold hover:text-black"
          >
            Aller a la connexion
          </a>
        </div>
      </main>
    );
  }

  const [categoriesRaw, nomineesRaw, nomineesWithVotes] = await Promise.all([
    prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    }),
    prisma.nominee.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.nominee.findMany({
      include: {
        category: true,
        _count: {
          select: { votes: true },
        },
      },
      orderBy: { category: { name: "asc" } },
    }),
  ]);

  const exportData = nomineesWithVotes.map((n) => ({
    nomineeName: n.name,
    categoryName: n.category.name,
    votesCount: n._count.votes,
  }));

  const categories = categoriesRaw as CategoryRecord[];
  const nominees = nomineesRaw as NomineeRecord[];
  const nomineeCountByCategory = nominees.reduce<Record<string, number>>((acc, nominee) => {
    acc[nominee.categoryId] = (acc[nominee.categoryId] ?? 0) + 1;
    return acc;
  }, {});
  const message = searchParams?.message ? decodeURIComponent(searchParams.message) : "";

  return (
    <main className="min-h-screen bg-black text-ivory">
      <section className="border-b border-gold/10 bg-white/[0.02]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-gold/60">Administration</p>
            <h1 className="mt-4 font-serif text-5xl md:text-7xl">Categories et nomines</h1>
            <p className="mt-4 max-w-2xl text-sm text-ivory/60">
              Gère les catégories, les nominés, leurs photos et leur classement.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <ExcelExport data={exportData} />
            <a
              href="/results"
              className="inline-flex w-fit items-center justify-center rounded-full border border-ivory/10 px-5 py-3 text-[11px] uppercase tracking-[0.3em] text-ivory/70 transition-colors hover:border-gold/30 hover:text-gold"
            >
              Voir les résultats
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-3">
        <div className="rounded-2xl border border-gold/10 bg-white/[0.03] p-6">
          <div className="text-[10px] uppercase tracking-[0.35em] text-gold/60">Categories</div>
          <div className="mt-3 font-serif text-5xl">{categories.length}</div>
        </div>
        <div className="rounded-2xl border border-gold/10 bg-white/[0.03] p-6">
          <div className="text-[10px] uppercase tracking-[0.35em] text-gold/60">Nomines</div>
          <div className="mt-3 font-serif text-5xl">{nominees.length}</div>
        </div>
        <div className="rounded-2xl border border-gold/10 bg-white/[0.03] p-6">
          <div className="text-[10px] uppercase tracking-[0.35em] text-gold/60">Connecte</div>
          <div className="mt-3 text-lg text-ivory">{session.user.email}</div>
        </div>
      </section>

      {message ? (
        <section className="mx-auto max-w-7xl px-6 pb-2">
          <div className="rounded-2xl border border-gold/20 bg-gold/10 px-5 py-4 text-sm text-gold">
            {message}
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-10 lg:grid-cols-2">
        <form action={createCategoryAction} className="rounded-3xl border border-gold/10 bg-white/[0.03] p-8 backdrop-blur-xl">
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold/60">Nouvelle categorie</p>
            <h2 className="mt-3 font-serif text-3xl">Ajouter une categorie</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">Nom</label>
              <input
                name="name"
                required
                className="w-full rounded-xl border border-ivory/10 bg-black/40 px-4 py-3 text-ivory outline-none transition-colors focus:border-gold/40"
                placeholder="Etudiant de l'annee"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">Slug</label>
              <input
                name="slug"
                className="w-full rounded-xl border border-ivory/10 bg-black/40 px-4 py-3 text-ivory outline-none transition-colors focus:border-gold/40"
                placeholder="student-of-the-year"
              />
              <p className="mt-2 text-xs text-ivory/35">Optionnel. S&apos;il est vide, il sera genere a partir du nom.</p>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gold px-5 py-3 text-[11px] font-bold uppercase tracking-[0.3em] text-black transition-colors hover:bg-gold/90"
            >
              Creer la categorie
            </button>
          </div>
        </form>

        <form action={createNomineeAction} encType="multipart/form-data" className="rounded-3xl border border-gold/10 bg-white/[0.03] p-8 backdrop-blur-xl">
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold/60">Nouveau nomine</p>
            <h2 className="mt-3 font-serif text-3xl">Ajouter un nomine</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">Categorie</label>
              <select
                name="categoryId"
                required
                defaultValue=""
                className="w-full rounded-xl border border-ivory/10 bg-black/40 px-4 py-3 text-ivory outline-none transition-colors focus:border-gold/40"
              >
                <option value="" disabled>
                  Choisir une categorie
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">Nom</label>
              <input
                name="name"
                required
                className="w-full rounded-xl border border-ivory/10 bg-black/40 px-4 py-3 text-ivory outline-none transition-colors focus:border-gold/40"
                placeholder="Amara Kone"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">Description</label>
              <input
                name="description"
                className="w-full rounded-xl border border-ivory/10 bg-black/40 px-4 py-3 text-ivory outline-none transition-colors focus:border-gold/40"
                placeholder="Informatique · L3"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">Photo</label>
              <input
                name="photo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="w-full rounded-xl border border-ivory/10 bg-black/40 px-4 py-3 text-sm text-ivory file:mr-4 file:rounded-lg file:border-0 file:bg-gold file:px-4 file:py-2 file:text-[11px] file:font-bold file:uppercase file:tracking-[0.2em] file:text-black"
              />
              <p className="mt-2 text-xs text-ivory/35">Formats acceptes: JPG, PNG, WEBP.</p>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gold px-5 py-3 text-[11px] font-bold uppercase tracking-[0.3em] text-black transition-colors hover:bg-gold/90"
            >
              Ajouter le nomine
            </button>
          </div>
        </form>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16">
        <div className="rounded-3xl border border-gold/10 bg-white/[0.03] p-8">
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold/60">Categories existantes</p>
            <h2 className="mt-3 font-serif text-3xl">Liste et modification</h2>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {categories.map((category) => (
              <div key={category.id} className="rounded-2xl border border-ivory/10 bg-black/30 p-5">
                <form action={updateCategoryAction} className="space-y-4">
                  <input type="hidden" name="id" value={category.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">Nom</label>
                      <input
                        name="name"
                        defaultValue={category.name}
                        className="w-full rounded-xl border border-ivory/10 bg-black/50 px-4 py-3 text-ivory outline-none focus:border-gold/40"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">Slug</label>
                      <input
                        name="slug"
                        defaultValue={category.slug}
                        className="w-full rounded-xl border border-ivory/10 bg-black/50 px-4 py-3 text-ivory outline-none focus:border-gold/40"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-xl bg-gold px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-black"
                    >
                      Mettre a jour
                    </button>
                    <button
                      type="submit"
                      formAction={deleteCategoryAction}
                      className="inline-flex items-center justify-center rounded-xl border border-red-500/30 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-red-300"
                    >
                      Supprimer
                    </button>
                  </div>
                </form>

                <div className="mt-5 text-sm text-ivory/50">
                  {nomineeCountByCategory[category.id] ?? 0} nomine(s)
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gold/10 bg-white/[0.03] p-8">
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold/60">Nomines existants</p>
            <h2 className="mt-3 font-serif text-3xl">Liste et modification</h2>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {nominees.map((nominee) => (
              <div key={nominee.id} className="overflow-hidden rounded-2xl border border-ivory/10 bg-black/30">
                <div className="relative aspect-[4/3] bg-black">
                  {nominee.photo ? (
                    nominee.photo.startsWith("data:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={nominee.photo}
                        alt={nominee.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={nominee.photo}
                        alt={nominee.name}
                        fill
                        className="object-cover"
                      />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-ivory/20">
                      Pas de photo
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <form action={updateNomineeAction} encType="multipart/form-data" className="space-y-4">
                    <input type="hidden" name="id" value={nominee.id} />

                    <div>
                      <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">Categorie</label>
                      <select
                        name="categoryId"
                        defaultValue={nominee.categoryId}
                        className="w-full rounded-xl border border-ivory/10 bg-black/50 px-4 py-3 text-ivory outline-none focus:border-gold/40"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">Nom</label>
                      <input
                        name="name"
                        defaultValue={nominee.name}
                        className="w-full rounded-xl border border-ivory/10 bg-black/50 px-4 py-3 text-ivory outline-none focus:border-gold/40"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">Description</label>
                      <input
                        name="description"
                        defaultValue={nominee.description}
                        className="w-full rounded-xl border border-ivory/10 bg-black/50 px-4 py-3 text-ivory outline-none focus:border-gold/40"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">Nouvelle photo</label>
                      <input
                        name="photo"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="w-full rounded-xl border border-ivory/10 bg-black/50 px-4 py-3 text-sm text-ivory file:mr-4 file:rounded-lg file:border-0 file:bg-gold file:px-4 file:py-2 file:text-[11px] file:font-bold file:uppercase file:tracking-[0.2em] file:text-black"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-xl bg-gold px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-black"
                      >
                        Mettre a jour
                      </button>
                      <button
                        type="submit"
                        formAction={deleteNomineeAction}
                        className="inline-flex items-center justify-center rounded-xl border border-red-500/30 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-red-300"
                      >
                        Supprimer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
