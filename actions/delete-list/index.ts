"use server"

import { auth } from "@clerk/nextjs/server"
import { DeleteList } from "./schema";
import {InputType,ReturnType} from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";


const handler=async (data:InputType):Promise<ReturnType>=>{
    const {userId,orgId}=await auth();
    if(!userId||!orgId){
        return {
            error:"unauthorized"
        }
    }
    const{id,boardId}=data;
    let list;
    try{
       list=await db.list.delete({
            where:{
                id,
                boardId,
            board:{
                orgId
            },
        },
            
        })

    }catch(error){
        return{
            error:"failed to delete."
        }

    }
    revalidatePath(`/board/${boardId}`)
   return{data:list}
}
export const deleteList=createSafeAction(DeleteList,handler)