import "./globals.css";
import DashboardHead from "@/components/DashboardHead";

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <DashboardHead />
        <main>{children}</main>
      </body>
    </html>
  );
}
