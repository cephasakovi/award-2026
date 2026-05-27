const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const studentNominees = [
  {
    name: "OKE Komlan Erwin",
    description: "Etudiant de l'année",
    photo: "/uploads/nominees/oke-komlan-erwin.png",
  },
  {
    name: "PEREIRA DA SILVA Péniel",
    description: "Etudiante de l'année",
    photo: "/uploads/nominees/pereira-da-silva-peniel.png",
  },
  {
    name: "ALI Dimilé Lauryn",
    description: "Etudiante de l'année",
    photo: "/uploads/nominees/ali-dimiline-lauryn.png",
  },
];

const coupDeCoeurNominees = [
  {
    name: "Komlan Innocent Agbana",
    description: "Etudiant coup de coeur de l'année",
    photo: "/uploads/nominees/coup-coeur-komlan-innocent-agbana.png",
  },
  {
    name: "Anagbla Vita",
    description: "Etudiant coup de coeur de l'année",
    photo: "/uploads/nominees/coup-coeur-anagbla-vita.png",
  },
  {
    name: "Atarigbe-Idrissou Nihad",
    description: "Etudiant coup de coeur de l'année",
    photo: "/uploads/nominees/coup-coeur-atarigbe-idrissou-nihad.png",
  },
];

async function main() {
  await prisma.vote.deleteMany();
  await prisma.nominee.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@awards.ci",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const studentPassword = await bcrypt.hash("student123", 10);
  await prisma.user.create({
    data: {
      email: "test@student.ci",
      password: studentPassword,
      role: "STUDENT",
    },
  });

  const categories = [
    {
      name: "Etudiant de l'année",
      slug: "student-of-the-year",
      nominees: studentNominees,
    },
    {
      name: "Etudiant coup de coeur de l'année",
      slug: "student-coup-de-coeur-of-the-year",
      nominees: coupDeCoeurNominees,
    },
    {
      name: "Délégué de l'année",
      slug: "delegate-of-the-year",
      nominees: [
        { name: "Lamine Traoré", description: "Président de promo", photo: null },
        { name: "Aïcha Wade", description: "Communication", photo: null },
        { name: "Kofi Dieng", description: "Trésorier", photo: null },
      ],
    },
    {
      name: "Professeur de l'année",
      slug: "teacher-of-the-year",
      nominees: [
        { name: "Dr Ibrahim Touré", description: "Informatique", photo: null },
        { name: "Pr Marie Ndiaye", description: "Économie", photo: null },
        { name: "Dr Jean Koffi", description: "Droit", photo: null },
      ],
    },
  ];

  for (const cat of categories) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
      },
    });

    for (const nom of cat.nominees) {
      await prisma.nominee.create({
        data: {
          name: nom.name,
          description: nom.description,
          photo: (nom as any).photo || null,
          categoryId: category.id,
        },
      });
    }
  }

  console.log("Base de données initialisée avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
