 
 
import { formSchema } from "@/components/modal/create-post-modal";
import { db } from "@/lib/db";
import axios from "axios";
import * as z from 'zod';

 

 

export const createPost = async (data:  z.infer<typeof formSchema>, authorId: string) => {

 console.log(data)
  const validatedFields = formSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: "Invlaid Fields" };
  }
  const {  title, content } = validatedFields.data;
   const post =  await db.post.create({
    data: {
      title,
      content,
      author: { connect: { id: authorId } }
    }
  });

 return {success:"Post cretaed " , post}
 
 
};
