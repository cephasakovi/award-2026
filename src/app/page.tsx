import { prisma } from "@/lib/prisma";
import HomePage from "@/components/home-page";

export default async function Home() {
  const categoriesFromDb = await prisma.category.findMany({
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

  const categories = categoriesFromDb.map((category, index) => ({
    id: category.id,
    index: String(index + 1).padStart(2, "0"),
    name: category.name,
    subtitle: "Candidature officielle",
    nominees: category.nominees.map((nominee) => ({
      id: nominee.id,
      name: nominee.name,
      description: nominee.description,
      score: nominee._count.votes,
      photo: nominee.photo ? (nominee.photo.startsWith("/") ? nominee.photo : `/${nominee.photo.replace(/^\/+/, "")}`) : undefined,
    })),
  }));

  return <HomePage categories={categories} />;
}
