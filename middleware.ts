import authConfig from "./auth.config"
import NextAuth from "next-auth"

 
import { NextResponse } from "next/server"
import next from "next"
import { AuthRoutes, DEFAULT_LOGIN_REDIRECT, apiAuthprefix, publicRoutes } from "./route"

export const { auth } = NextAuth(authConfig)

export default auth((req: any) => {
  const { nextUrl, user } = req;
  const isLoggedIn = !!req.auth;
 
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthprefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = AuthRoutes.includes(nextUrl.pathname); 
 
 
  if (isApiAuthRoute) {
    return null;  
  }

  if (isAuthRoute ) {
      
 if(isLoggedIn){ 
    return Response.redirect(new URL( "/posts", nextUrl)); 
 }
 return null;
    } 
    
    
  if (!isLoggedIn && !isPublicRoute) {
      return Response.redirect(new URL("/auth/login", nextUrl));
 }
  
    return null;  
  
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
