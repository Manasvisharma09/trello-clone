import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
 {params}: { params:{cardId: string } }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

   

    
    const card = await db.card.findUnique({
      where: {
        id: params.cardId,
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
    console.error("[CARD_ID_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
