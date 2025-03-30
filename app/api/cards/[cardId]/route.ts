import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ cardId: string }> } // 🔥 Fix: params is a Promise
) {
  try {
    const resolvedParams = await context.params; // 🔥 Fix: Await params
    console.log("✅ Resolved Params:", resolvedParams);

    // Authenticate User
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      console.error("❌ Unauthorized request");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch Card Data
    const card = await db.card.findUnique({
      where: {
        id: resolvedParams.cardId,
        list: {
          board: {
            orgId,
          },
        },
      },
      include: {
        list: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("❌ Internal Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
