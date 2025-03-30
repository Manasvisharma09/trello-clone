import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ListContainer } from "./_components/list-container";

interface BoardIdPageProps {
  params: Promise<{ boardId: string }>; // 🔥 Fix: Make params a Promise
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const resolvedParams = await params; // 🔥 Fix: Await params before use
  console.log("✅ Resolved Params:", resolvedParams);

  if (!resolvedParams?.boardId) {
    console.error("❌ No boardId found, redirecting...");
    return redirect("/select-org");
  }

  const { orgId } = await auth();
  console.log("✅ Org ID:", orgId);

  if (!orgId) {
    console.error("❌ No orgId found, redirecting...");
    return redirect("/select-org");
  }

  const lists = await db.list.findMany({
    where: {
      boardId: resolvedParams.boardId,
      board: {
        orgId,
      },
    },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer boardId={resolvedParams.boardId} data={lists} />
    </div>
  );
};

export default BoardIdPage;
