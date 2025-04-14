import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ENTITY_TYPE } from "@prisma/client";

export async function GET(
  request: Request,
  context: { params: { cardId: string } }
) {
  try {
    const { cardId } = context.params;
    console.log("✅ Resolved Params:", cardId);

    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      console.error("❌ Unauthorized request");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const auditLogs = await db.auditLog.findMany({
      where: {
        orgId,
        entityId: cardId,
        entityType: ENTITY_TYPE.CARD,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    return NextResponse.json(auditLogs);
  } catch (error) {
    console.error("❌ Internal Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
