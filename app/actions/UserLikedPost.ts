'use server'
import { db } from "@/lib/db";

export async function  userLikedPost(userId: string, postId: string){
    const like = await  db.like.findUnique({
        where: {
          postId_userId: {
            postId: postId,
            userId: userId,
          },
        }, 
      });   

   return !!like;
   
       
}
   
 