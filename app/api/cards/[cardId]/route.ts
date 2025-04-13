import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    console.log("✅ Params:", params);
    
    // Authenticate User
    const { userId, orgId } = await auth();
    
    if (!userId || !orgId) {
      console.error("❌ Unauthorized request");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Fetch Card Data
    const card = await db.card.findUnique({
      where: {
        id: params.cardId,
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