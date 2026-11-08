"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const j = await res.json();
      if (res.ok && j.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setErr("ایمیل یا رمزعبور اشتباه است");
      }
    } catch {
      setErr("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white/5 p-8 rounded-2xl border border-white/10"
      >
        <h2 className="text-2xl font-semibold text-white mb-4">ورود ادمین</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ایمیل"
          type="email"
          className="w-full p-3 mb-3 rounded bg-gray-900 text-white outline-none
            focus:ring-1 focus:ring-orange-500"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمزعبور"
          type="password"
          className="w-full p-3 mb-3 rounded bg-gray-900 text-white outline-none
            focus:ring-1 focus:ring-orange-500"
        />
        {err && <div className="text-red-400 mb-3 text-sm">{err}</div>}
        <button
          disabled={loading}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50
            rounded text-white transition-colors"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </div>
  );
}
