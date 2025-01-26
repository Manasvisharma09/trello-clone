"use server"

import { auth } from "@clerk/nextjs/server"
import { UpdateBoard  } from "./schema";
import {InputType,ReturnType} from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";

const handler=async (data:InputType):Promise<ReturnType>=>{
    const {userId,orgId}=await auth();
    if(!userId||!orgId){
        return {
            error:"unaothorized"
        }
    }
    const{title,id}=data;
    let board;
    try{
        board=await db.board.update({
            where:{
                id,
                orgId,
            },
            data:{
                title,
            }
        })

    }catch(error){
        return{
            error:"failed to update."
        }

    }
    revalidatePath(`/board/${id}`)
    return {data:board}
}
export const updateBoard=createSafeAction(UpdateBoard,handler)