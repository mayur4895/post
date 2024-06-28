"use server";

import { signIn } from "@/auth"; 
 
 
 
import { db } from "@/lib/db";
 
 
 
 

import { AuthError } from "next-auth";
import z from "zod";
import LoginSchema from "../schemas/LoginSchema";
import { getUserByUsername } from "../data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invlaid Fields" };
  }
  const { username, password } = validatedFields.data;


  const ExistUser = await  getUserByUsername(username);

  if(!ExistUser || !ExistUser.password) {
    return {error:"User does not exist"}
  }
   
  try {
    await signIn("credentials", { 
      username: username,
      redirect: false,
      password: password,  
    });
    return { success: "Loged In" };
  } catch (error) {
  console.log(error)
  }
};
