"use server"
import { ACTION } from "@prisma/client";
import { auth } from "@clerk/nextjs/server"
import { CopyCard } from "./schema";
import {InputType,ReturnType} from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { ENTITY_TYPE } from "@prisma/client";


const handler=async (data:InputType):Promise<ReturnType>=>{
    const {userId,orgId}=await auth();
    if(!userId||!orgId){
        return {
            error:"unauthorized"
        }
    }
    const{id,boardId}=data;
    let card;
    try{
      const cardToCopy=await db.card.findUnique({
            where:{
                id,
                list:{
                    board:{
                        orgId,
                    },
                },
            }   
        });
        if(!cardToCopy){
            return {
                error:"card not found"
            }
        }
        const lastCard=await db.card.findFirst({
            where:{listId:cardToCopy.listId},
            orderBy:{order:"desc"},
            select:{order:true}
        })
        const newOrder=lastCard?lastCard.order+1:1;
        card=await db.card.create({
            data:{
                title:`${cardToCopy.title}-Copy`,
                description:cardToCopy.description,
                order:newOrder,
                listId:cardToCopy.listId
            },
        })
        await createAuditLog({
            entityTitle:card.title,
            entityId:card.id,
            entityType:ENTITY_TYPE.CARD,
            action:ACTION.CREATE,
        })
        
              
        
    }catch(error){
        return{
            error:"failed to copy."
        }

    }
    revalidatePath(`/board/${boardId}`)
   return{data:card}
}
export const copyCard=createSafeAction(CopyCard,handler)