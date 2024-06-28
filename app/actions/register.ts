'use server' 
  
 
import { zodResolver } from "@hookform/resolvers/zod";
import { error } from "console";
import bcryptjs from "bcryptjs"
 
import z from "zod"
import RegisterSchema from "../schemas/RegisterSchema";
import { db } from "@/lib/db";
  
export const  register = async (values :z.infer <typeof RegisterSchema>)=>{
      
    try {
        const validatedFields =  RegisterSchema.safeParse(values);

         if(!validatedFields.success){
            return   {error: "Invlaid Fields"}
         };

const {username,email,password} = validatedFields.data;

   const salt = await bcryptjs.genSalt(10);
const hashpassword = await bcryptjs.hash(password, salt);
         
    const userExist = await db.user.findUnique({
        where: {
          email: email,
          username:username
        }
      });

      if(userExist){
        return  {error: "User already exists"}
      }
      
       await db.user.create({

        data: {
         username: username,
          email: email,
          password: hashpassword
        }
      })
     
 
      return {success:"User Register"} 
        
      } catch (error) {
        console.log(error); 
  
      }
    }