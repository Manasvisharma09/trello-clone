import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ListContainer } from "./_components/list-container";

interface BoardIdPageProps {
  params?: { boardId?: string }; // ✅ Ensure params are optional & safely checked
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  if (!params?.boardId) {
    return redirect("/select-org"); // ✅ Redirect if boardId is missing
  }

  const { orgId } = await auth();
  if (!orgId) {
    return redirect("/select-org");
  }

  console.log("✅ Board ID:", params.boardId);
  console.log("✅ Org ID:", orgId);

  const lists = await db.list.findMany({
    where: {
      boardId: params.boardId,
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
      <ListContainer boardId={params.boardId} data={lists} />
    </div>
  );
};

export default BoardIdPage;
