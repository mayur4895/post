"use server";

import { signIn } from "@/auth";
 
 
import { db } from "@/lib/db";
 
 
 
 

import { AuthError } from "next-auth";
import z from "zod";
import ResetSchema from "../schemas/ResetSchema";
import { getUserByEmail } from "../data/user";
import { generatePasswordResetToken } from "@/lib/token";
export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invlaid Fields" };
  }
  const { email  } = validatedFields.data;


  const ExistUser = await  getUserByEmail(email);

  if(!ExistUser) {
    return {error:"email does not exist"}
  }
  
  
 

    const passwordResetToken = await generatePasswordResetToken(email)
  
      
    if(passwordResetToken.email && passwordResetToken.token) {
        
  return  {success: "refirect to password reset" ,data:{
    reset_password :`http://localhost:3000/auth/new-password?token=${passwordResetToken.token}`  , 
    email: passwordResetToken.email ,
  } 
  }
       }
 
 
 
};
