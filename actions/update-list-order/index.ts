"use server"

import {auth} from "@clerk/nextjs/server"
import {UpdateListOrder } from "./schema";
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
    const{items,boardId}=data;
    let lists;
    try{
        const transaction=items.map((list)=>
            db.list.update({
                where:{
                    id:list.id,
                    board:{
                        orgId,
                    },
                },
                data:{
                    order:list.order,
                },
            })
        
        )
        lists =await db.$transaction(transaction);

    }catch(error

    ){
        return{
            error:"failed to reorder"
        }

    }
    revalidatePath(`/board/${boardId}`)
    return {data:lists}
}
export const updateListOrder=createSafeAction(UpdateListOrder,handler)