import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ENTITY_TYPE } from "@prisma/client";

export async function GET(
  request: Request,
  {params}: { params:{cardId: string } }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      console.error("❌ Unauthorized request");
      return new NextResponse("Unauthorized", { status: 401 });
    }
   
    

    const auditLogs = await db.auditLog.findMany({
      where: {
        orgId,
        entityId: params.cardId,
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
