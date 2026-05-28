import { prisma } from "@/lib/prisma";
import HomePage from "@/components/home-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  const [categoriesFromDb, userVotes] = await Promise.all([
    prisma.category.findMany({
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
    }),
    session?.user?.id
      ? prisma.vote.findMany({
          where: { userId: session.user.id },
        })
      : Promise.resolve([]),
  ]);

  const initialVotes = userVotes.reduce<Record<string, string>>((acc, vote) => {
    acc[vote.categoryId] = vote.nomineeId;
    return acc;
  }, {});

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
      photo: nominee.photo ? (nominee.photo.startsWith("/") || nominee.photo.startsWith("data:") ? nominee.photo : `/${nominee.photo.replace(/^\/+/, "")}`) : undefined,
    })),
  }));

  return <HomePage categories={categories} initialVotes={initialVotes} />;
}
