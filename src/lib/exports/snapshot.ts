import { prisma } from "@/lib/prisma";

type ExportRow = {
  nomineeName: string;
  categoryName: string;
  votesCount: number;
};

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function toCsvContent(rows: ExportRow[]) {
  const headers = ["Nom du Nomine", "Categorie", "Nombre de votes"];
  const lines = rows.map((row) =>
    [escapeCsv(row.nomineeName), escapeCsv(row.categoryName), String(row.votesCount)].join(";"),
  );
  return [headers.join(";"), ...lines].join("\r\n");
}

export async function buildResultsRows(): Promise<ExportRow[]> {
  const nominees = await prisma.nominee.findMany({
    include: {
      category: true,
      _count: {
        select: { votes: true },
      },
    },
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
  });

  return nominees.map((nominee) => ({
    nomineeName: nominee.name,
    categoryName: nominee.category.name,
    votesCount: nominee._count.votes,
  }));
}

export async function createDailySnapshot() {
  const rows = await buildResultsRows();
  const csvContent = toCsvContent(rows);
  const totalVotes = rows.reduce((sum, row) => sum + row.votesCount, 0);

  const dateTag = new Date().toISOString().slice(0, 10);
  const fileName = `resultats-awards-lbs-2026-${dateTag}.csv`;

  const snapshot = await prisma.exportSnapshot.upsert({
    where: { fileName },
    update: {
      csvContent,
      totalVotes,
    },
    create: {
      fileName,
      csvContent,
      totalVotes,
    },
  });

  return snapshot;
}
