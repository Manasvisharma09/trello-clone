import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RouteParams {
  cardId: string;
}

export async function GET(
  req: Request,
  { params }: { params: RouteParams }
) {
  try {
    const cardId = params.cardId;
    console.log("✅ Card ID:", cardId);
    
    // Authenticate User
    const { userId, orgId } = await auth();
    
    if (!userId || !orgId) {
      console.error("❌ Unauthorized request");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Fetch Card Data
    const card = await db.card.findUnique({
      where: {
        id: cardId,
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