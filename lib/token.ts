import { v4 as uuid } from "uuid"
import { db } from "./db"; 
import crypto from "crypto"
import { getPasswordResetTokenbyEmail } from "@/app/data/password-reset-token";
 
 
  
 
// generate password reset token

export const generatePasswordResetToken= async(email:string)=>{


    const token = uuid();
    const expires = new Date (new Date().getTime() + 3600 *1000);  
    const existingToken =  await  getPasswordResetTokenbyEmail(email);


    if(existingToken){
        await db.passwordResetToken.delete({
            where:{id:existingToken.id}, 
        })
    }
   

    const passwordResetToken = await db.passwordResetToken.create({
        data:{
            token,
            expires,
            email
        }
    }) 
  
    return passwordResetToken; 
}




 