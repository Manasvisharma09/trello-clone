import {z} from "zod"

export const UpdateCard=z.object({
    boardId:z.string(),
    description:z.optional(
        z.string({
            required_error:"Description is required",
            invalid_type_error:"description is required",
        }).min(3,{
            message:"Description is too short."
        })
    ),

    title:z.string({
        required_error:"title is required",
        invalid_type_error:"title is required"
    }).min(3,{
        message:"title is too short",
    }),
    id:z.string(),
})