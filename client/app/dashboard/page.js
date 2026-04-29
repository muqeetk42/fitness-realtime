"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../lib/api";

export default function DashboardPage() {
  // State to hold the authenticated user's data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Next.js router for programmatic navigation
  const router = useRouter();

  // On component mount, attempt to fetch the user's data from the protected route
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // This request automatically carries the JWT via our api.js interceptor
        const res = await getUser();
        setUser(res.data);
      } catch (err) {
        // If the token is missing, expired, or invalid, the server returns 401
        // Our response interceptor will auto-redirect to /login
        // But as a safety net, we also handle it here
        console.error("Failed to fetch user:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Loading state while verifying the token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="text-gray-400 text-lg animate-pulse">
          Verifying session...
        </div>
      </div>
    );
  }

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all duration-200 cursor-pointer"
          >
            Log Out
          </button>
        </div>

        {/* Welcome Card */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Welcome back, {user?.username} 👋
          </h2>
          <p className="text-gray-400 mb-6">
            Your fitness journey continues. Here is your profile data:
          </p>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Username</p>
              <p className="text-white font-medium">{user?.username}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="text-white font-medium">{user?.email}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">User ID</p>
              <p className="text-white font-mono text-sm">{user?._id}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <p className="text-green-400 font-medium">Authenticated ✅</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
