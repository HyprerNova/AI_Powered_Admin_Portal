import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {session.user.name}</h1>
        <form action="/api/auth/signout" method="POST">
          <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
            Logout
          </button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/add-student">
          <div className="p-6 bg-blue-500 text-white text-center rounded hover:bg-blue-600">
            Add Student
          </div>
        </Link>
        <Link href="/view-student">
          <div className="p-6 bg-green-500 text-white text-center rounded hover:bg-green-600">
            View Students
          </div>
        </Link>
        <Link href="/register">
          <div className="p-6 bg-purple-500 text-white text-center rounded hover:bg-purple-600">
            Register Admin
          </div>
        </Link>
      </div>
    </div>
  );
}