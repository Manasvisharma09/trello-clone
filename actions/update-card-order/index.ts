"use server"

import {auth} from "@clerk/nextjs/server"
import {UpdateCardOrder } from "./schema";
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
    let updatedCards;
    try{
        const transaction=items.map((card)=>
            db.card.update({
                where:{
                    id:card.id,
                    list:{
                        board:{
                            orgId,
                        },
                    },
                },
                data:{
                    order:card.order,
                    listId:card.listId,
                },
            }),
        );
        updatedCards=await db.$transaction(transaction)


    }catch(error ){
        return{
            error:"failed to reorder"
        }

    }
    revalidatePath(`/board/${boardId}`)
    return {data:updatedCards}
}
export const updateCardOrder=createSafeAction(UpdateCardOrder,handler)