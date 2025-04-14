import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import "./globals.css";
import DashboardHead from "@/components/DashboardHead";

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  if (!session && (window.location.pathname.startsWith("/dashboard") || window.location.pathname.startsWith("/add-student") || window.location.pathname.startsWith("/view-student"))) {
    redirect("/login");
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        {session && <DashboardHead />}
        <main>{children}</main>
      </body>
    </html>
  );
}