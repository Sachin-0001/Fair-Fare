"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, FileText, LogOut, Newspaper, Home } from "lucide-react";

export function SidebarDrive() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication token (e.g., from localStorage or cookies)
    localStorage.removeItem("authToken"); // Example: Remove token from localStorage
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Example: Clear cookie

    // Redirect to login page
    router.push("/");
  };

  return (
    <div className="fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/driver/dashboard"
                className={`flex items-center gap-2 p-2 rounded-md ${
                  pathname === "/driver/dashboard" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/driver/dashboard/#overview"
                className={`flex items-center gap-2 p-2 rounded-md ${
                  pathname === "/book" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                <Newspaper className="h-5 w-5" />
                <span>Driver Stats</span>
              </Link>
            </li>
            <li>
              <Link
                href="/driver/profile"
                className={`flex items-center gap-2 p-2 rounded-md ${
                  pathname === "/driver/profile" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Profile Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full p-2 rounded-md text-red-500 hover:bg-gray-700"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
