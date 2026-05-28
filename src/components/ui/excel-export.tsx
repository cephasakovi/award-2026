"use client";

import React from "react";

interface ExcelExportProps {
  data: {
    nomineeName: string;
    categoryName: string;
    votesCount: number;
  }[];
}

export default function ExcelExport({ data }: ExcelExportProps) {
  const handleExport = () => {
    // 1. En-têtes et lignes du fichier CSV
    const headers = ["Nom du Nomine", "Categorie", "Nombre de votes"];
    const rows = data.map((item) => [
      `"${item.nomineeName.replace(/"/g, '""')}"`,
      `"${item.categoryName.replace(/"/g, '""')}"`,
      item.votesCount,
    ]);

    // 2. Génération du contenu CSV (séparateur point-virgule pour compatibilité native Excel français)
    const csvContent = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");

    // 3. Ajout de la signature UTF-8 BOM (\uFEFF) pour le support complet des accents sous Excel
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // 4. Création d'un lien invisible pour forcer le téléchargement
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `resultats-awards-lbs-2026-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex w-fit items-center justify-center rounded-full bg-gold px-5 py-3 text-[11px] font-bold uppercase tracking-[0.3em] text-black transition-colors hover:bg-gold/90 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
    >
      Exporter sous Excel
    </button>
  );
}
