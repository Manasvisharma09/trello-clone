import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const isPublicRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)', '/api/webhook']);


export default clerkMiddleware(async (auth, req) => {
  try {
    console.log("Inside Clerk Middleware");

    const { userId, orgId, redirectToSignIn } = await auth();
    console.log("Auth Response:", { userId, orgId });

    // Handle authenticated users
    if (userId) {
      const path = orgId ? `/organization/${orgId}` : '/select-org';
      if (req.nextUrl.pathname === '/' || isPublicRoute(req)) {
        const redirectUrl = new URL(path, req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Handle unauthenticated users
    if (!userId && !isPublicRoute(req)) {
      console.log("Redirecting unauthenticated user to sign-in.");
      const redirectUrl = req.url || "/"; // Fallback if URL is missing
      return redirectToSignIn({ returnBackUrl: redirectUrl });
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    return NextResponse.next();
  }
});


// Middleware configuration
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/api/webhook' // <-- Adding webhook route explicitly
  ],
};


// Debugging logs for environment variables
console.log("Test Variable:", process.env.TEST_VARIABLE);
console.log("Clerk Key:", process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
 