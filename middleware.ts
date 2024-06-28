import { auth } from "./auth";
import { AuthRoutes, apiAuthprefix, publicRoutes } from "./route";
// Assuming types are defined in types/index.ts
 
type NextAuthRequest = any;
type AppRouteHandlerFnContext = any;


export default auth(async (req: NextAuthRequest, ctx: AppRouteHandlerFnContext): Promise<void | Response> => {
    const { nextUrl, user } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthprefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = AuthRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return Response.redirect(new URL("/api-auth", nextUrl));
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL("/posts", nextUrl));
        }
        return Response.redirect(new URL("/auth/login", nextUrl));
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth/login", nextUrl));
    }

    // Ensure a valid response (e.g., return a 404 page if needed)
    return Response.redirect(new URL("/404", nextUrl));
});
