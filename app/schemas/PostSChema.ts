import * as z from "zod"

export const PostSchema = z.object({
    title: z.string().min(2).max(50),
     content: z
    .string()
    .min(10, {
      message: "content must be at least 10 characters.",
    })
    .max(160, {
      message: "content must not be longer than 30 characters.",
    }),
})