import { auth } from "./auth";
import { AuthRoutes, apiAuthprefix, publicRoutes } from "./route";

export default auth(async (req: NextAuthRequest, ctx: AppRouteHandlerFnContext) => {
    const { nextUrl, user } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthprefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = AuthRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL("/posts", nextUrl));
        }
        return null;
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth/login", nextUrl));
    }

    // Ensure a valid response (e.g., return a 404 page if needed)
    return Response.redirect(new URL("/404", nextUrl));
});
