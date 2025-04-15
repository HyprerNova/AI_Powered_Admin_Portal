import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome, {session.user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h3>
            <div className="mt-4 space-y-2">
              <div className="text-sm text-gray-600">
                Last login: {new Date().toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">
                Account type: {session.user.role || "Admin"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
