 
 
import { formSchema } from "@/components/modal/create-post-modal";
import { db } from "@/lib/db";
import axios from "axios";
import * as z from 'zod';

 

 

export const DeletePost = async ( postId: string) => {

  
 
 
   const post =  await db.post.delete({
    where:{
        id:postId, 
    }
  });

 return {success:"Post deleted " , post}
 
 
};
