import { getServerSession } from "next-auth";
import "./globals.css";
import DashboardHead from "@/components/DashboardHead";

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        {session && <DashboardHead />}
        <main>{children}</main>
      </body>
    </html>
  );
}
