import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Custom logic if needed
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const protectedRoutes = ["/dashboard", "/add-student", "/view-student"];
        const path = req.nextUrl.pathname;

        if (protectedRoutes.some((route) => path.startsWith(route)) && !token) {
          return false; // Unauthorized
        }
        return true; // Authorized
      },
    },
    pages: {
      signIn: "/", // Redirect to login page if unauthorized
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/add-student/:path*", "/view-student/:path*"],
};
