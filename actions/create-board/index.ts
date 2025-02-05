"use server" 
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import {InputType   ,ReturnType } from "./types"
import { revalidatePath } from "next/cache"
import { createSafeAction } from "@/lib/create-safe-action"
import { CreateBoard } from "./schema"
import { createAuditLog } from "@/lib/create-audit-log"
import { ACTION,ENTITY_TYPE } from "@prisma/client";
import { incrementAvailableCount,hasAvailableCount } from "@/lib/org-limits"

const handler=async (data:InputType):Promise<ReturnType>=>{
    const {userId,orgId}=await auth();
    if(!userId||!orgId){
        return{
            error:"Unauthorized",
        }

    }
    const canCreate=await hasAvailableCount();
    if(!canCreate){
        return{
            error:"you have reached your limit of free boards.Please upgrade to create more. "
        }
    }
    const {title,image}=data;
    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName


    ]=image.split("|");
    console.log({
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
});
    if(!imageId||!imageThumbUrl||!imageFullUrl||!imageUserName||!imageLinkHTML){
        return{
            error:"missing fields.failed to create board"

        }
    }
    let board;
    try{
        
        board=await db.board.create({
            data:{
                title,
                orgId,
                 imageId,
                imageThumbUrl,
                imageFullUrl,
                imageLinkHTML,
                imageUserName
            }
        })
        await createAuditLog({
        entityTitle:board.title,
        entityId:board.id,
        entityType:ENTITY_TYPE.BOARD,
        action:ACTION.CREATE,
                        })
        
    }catch(error){
        return{
            error:"Failed to create."
        }
    }
     revalidatePath(`/board/${board.id}`);
     return{data:board};
}

export const createBoard=createSafeAction(CreateBoard,handler);
 