"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function DashboardHead() {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleLogout = () => {
    if (isConfirming) {
      signOut({ callbackUrl: "/login" });
    } else {
      const confirmed = window.confirm("Are you sure you want to sign out?");
      if (confirmed) {
        setIsConfirming(true);
        signOut({ callbackUrl: "/login" });
      }
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <div className="space-x-4">
        <Link href="/add-student" className="hover:underline">
          Add Student
        </Link>
        <Link href="/view-student" className="hover:underline">
          View Student
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </header>
  );
}