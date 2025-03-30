import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { BoardNavbar } from "./_components/board-navbar";

// Fix: Awaiting params since Next.js might resolve it as a Promise
export async function generateMetadata({ params }: { params: Promise<{ boardId: string }> }) {
  const resolvedParams = await params; // Fix: Ensure params is awaited
  console.log("generateMetadata params:", resolvedParams);

  const { orgId } = await auth();
  if (!orgId) {
    return { title: "Board" };
  }

  const board = await db.board.findUnique({
    where: { id: resolvedParams.boardId, orgId },
  });

  return {
    title: board?.title || "Board",
  };
}

const BoardIdLayout = async ({ children, params }: { children: React.ReactNode; params: Promise<{ boardId: string }> }) => {
  const resolvedParams = await params; // Fix: Await params to get actual boardId
  console.log("BoardIdLayout params:", resolvedParams);

  const { orgId } = await auth();
  console.log("BoardIdLayout orgId:", orgId);

  if (!orgId) {
    console.error("No orgId found, redirecting...");
    redirect("/select-org");
  }

  const board = await db.board.findUnique({
    where: { id: resolvedParams.boardId, orgId },
  });

  if (!board) {
    console.error("Board not found, triggering notFound()");
    notFound();
  }

  return (
    <div
      className="relative h-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl || "/default-background.jpg"})` }}
    >
      <BoardNavbar data={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default BoardIdLayout;
