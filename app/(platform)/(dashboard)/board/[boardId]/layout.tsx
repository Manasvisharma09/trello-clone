import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { BoardNavbar } from "./_components/board-navbar";

export async function generateMetadata({ params }: { params: { boardId: string } }) {
  const board = await db.board.findUnique({
    where: { id: params.boardId },
    select: { title: true },
  });

  return {
    title: board?.title || "Board",
  };
}

const BoardIdLayout = async ({ children, params }: { children: React.ReactNode; params: { boardId: string } }) => {
  const { orgId } = await auth();
  if (!orgId) redirect("/select-org");

  const board = await db.board.findUnique({
    where: { id: params.boardId, orgId },
  });

  if (!board) notFound();

  return (
    <div
      className="relative h-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl || "/default-background.jpg"})` }} // Fallback image
    >
      <BoardNavbar data={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default BoardIdLayout;
