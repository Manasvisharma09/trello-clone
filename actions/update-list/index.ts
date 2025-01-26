"use server"

import { auth } from "@clerk/nextjs/server"
import { UpdateList  } from "./schema";
import {InputType,ReturnType} from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { useAction } from "@/hooks/use-action";


const handler=async (data:InputType):Promise<ReturnType>=>{
    const {userId,orgId}=await auth();
    if(!userId||!orgId){
        return {
            error:"unaothorized"
        }
    }
    const{title,id,boardId}=data;
    let list;
    try{
       list=await db.list.update({
            where:{
                id,
               boardId,
               board:{
                orgId,
               },
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
    revalidatePath(`/board/${boardId}`)
    return {data:list}
}
export const updateList=createSafeAction(UpdateList,handler)