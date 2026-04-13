"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // ✅ added

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ added

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        alert(data.message);
      }

      setForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false); // ✅ added
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 text-white placeholder-gray-300"
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 text-white placeholder-gray-300"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 text-white placeholder-gray-300"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 transition duration-200 py-3 rounded-lg font-semibold active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 010-16z"
                  />
                </svg>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}