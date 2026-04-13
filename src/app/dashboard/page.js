"use client";

import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const res = await fetchWithAuth("/api/auth/user/me");

      if (!res || res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      } else {
        router.push("/login");
      }

      setLoading(false);
    };

    getData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-black">
        <h2 className="text-white text-xl animate-pulse">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  const handlelogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
        
        <h1 className="text-3xl font-bold text-center mb-6">
          Dashboard
        </h1>

        {user && (
          <div className="space-y-3 text-center">
            <p className="text-lg">
              👋 Welcome, <span className="font-semibold">{user.name}</span>
            </p>
            <p className="text-gray-300 text-sm">
              {user.email}
            </p>
          </div>
        )}

        <button
          onClick={handlelogout}
          className="mt-8 w-full bg-red-500 hover:bg-red-600 transition duration-200 py-2 rounded-lg font-semibold active:scale-95"
        >
          Logout
        </button>

      </div>
    </div>
  );
}