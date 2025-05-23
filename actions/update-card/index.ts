"use server"

import { auth } from "@clerk/nextjs/server"
import { UpdateCard} from "./schema";
import {InputType,ReturnType} from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler=async (data:InputType):Promise<ReturnType>=>{
    const {userId,orgId}=await auth();
    if(!userId||!orgId){
        return {
            error:"unaothorized"
        }
    }
    const{id,boardId,...values}=data;
    let card;
    try{
        card=await db.card.update({
            where:{
                id,
                list:{
                    board:{
                        orgId,
                    }
                },
            },
            data:{
              ...values,
            }
        })
        await createAuditLog({
                         entityTitle:card.title,
                         entityId:card.id,
                         entityType:ENTITY_TYPE.CARD,
                         action:ACTION.UPDATE,
         })

    }catch(error){
        return{
            error:"failed to update."
        }

    }
    revalidatePath(`/board/${boardId}`)
    return {data:card}
}
export const updateCard=createSafeAction(UpdateCard,handler)