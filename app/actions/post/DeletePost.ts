 'use server'
 
import { formSchema } from "@/components/modal/create-post-modal";
import { db } from "@/lib/db";
 

  

export const DeletePost = async (postId: string) => {

 
  
 
  await db.post.delete({
      where:{
        id:postId,
      }
  });

 return {success:"Post Deleted "}
 
 
};
