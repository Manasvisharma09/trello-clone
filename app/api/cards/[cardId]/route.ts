import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Params {
  cardId: string;
}

export async function GET(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    

    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const resolvedParams = await context.params; // Await the params if they are async
    const { cardId } = resolvedParams;

    const card = await db.card.findUnique({
      where: {
        id: cardId,
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
