import NextAuth from "next-auth" 
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db" 
import { PrismaClient } from "@prisma/client"
import { getUserById } from "./app/data/user"
 
const prisma = new PrismaClient()
 
export const { handlers, auth ,signIn,signOut} = NextAuth({
   pages:{
      signIn:"/auth/login",
      error:"/auth/error",
      signOut:"/"
       
   },

   events:{
      async linkAccount({user}){
         await db.user.update({
            where:{id:user.id},
            data:{emailVerified:new Date()}
         })
      }
   },
  callbacks:{


   async signIn({user,account}){

      if(account?.provider !== "credentials") return true; 
       if(!user.id){
         return false;
       }
      const ExistingUser = await getUserById(user.id); 

      if(!ExistingUser) return false;
       
      return true;

 
   },

  async session({token,session}){
     if(token.sub && session.user ){ 
     session.user.id = token.sub; 
   
   
  }


  if(token.role && session.user ){ 
  
 }
  return session
},

async jwt({token}){ 
   if(!token.sub) return token; 
   const userExist = await getUserById(token.sub); 
   if(!userExist) return token; 
   token.username = userExist.username;  
   token.email = userExist.email 
   return token;  
   }
  },

  adapter: PrismaAdapter(prisma), 
  session: { strategy: "jwt" },
  ...authConfig,
  secret:process.env.AUTH_SECRET
})