"use client";

import useSWR from "swr";
import { useState } from "react";
import { Trash2, Check, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const fetcher = async (url: string) => {
  const r = await fetch(url);
  if (r.status === 401) {
    // session expired or revoked -> back to the login screen
    window.location.href = "/admin/login";
    throw new Error("unauthorized");
  }
  return r.json();
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data, mutate } = useSWR("/api/admin/messages", fetcher, {
    refreshInterval: 5000,
  });
  const [loading, setLoading] = useState(false);

  async function markRead(id: number, read: boolean) {
    setLoading(true);
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
    await mutate();
    setLoading(false);
  }

  async function remove(id: number) {
    if (!confirm("این پیام حذف بشه؟")) return;
    setLoading(true);
    await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await mutate();
    setLoading(false);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">پیام‌های تماس</h1>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>

        {!data?.ok && <div className="text-gray-400">در حال بارگذاری...</div>}

        {data?.ok && data.data.length === 0 && (
          <div className="text-gray-500 text-center py-12">
            پیامی وجود ندارد
          </div>
        )}

        <div className="space-y-4">
          {data?.data?.map((m: any) => (
            <div
              key={m.id}
              className={`p-4 rounded-lg border ${
                m.read
                  ? "bg-white/5 border-white/10"
                  : "bg-orange-900/10 border-orange-600"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold">{m.name}</h3>
                    <span className="text-sm text-gray-300">{m.email}</span>
                    <span className="text-sm text-gray-500">
                      · {new Date(m.createdAt).toLocaleString("fa-IR")}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-200">{m.message}</p>
                  {m.phone && (
                    <p className="text-sm text-gray-400 mt-2">
                      تلفن: {m.phone}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => markRead(m.id, !m.read)}
                    disabled={loading}
                    title={
                      m.read
                        ? "علامت‌گذاری به‌عنوان نخوانده"
                        : "علامت‌گذاری به‌عنوان خوانده‌شده"
                    }
                    className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => remove(m.id)}
                    disabled={loading}
                    title="حذف"
                    className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
