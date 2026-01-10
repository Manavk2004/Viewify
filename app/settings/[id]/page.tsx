"use client";

import React from "react";
import SideBar from "@/components/sidebar";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter()
  const trpc = useTRPC()
  const { theme, setTheme } = useTheme()

  // Avoid hydration mismatch from next-themes values changing between SSR and client.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const meQuery = useQuery(trpc.user.me.queryOptions())

  const [name, setName] = React.useState("")
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [deletePassword, setDeletePassword] = React.useState("")

  React.useEffect(() => {
    if (meQuery.data?.name) setName(meQuery.data.name)
  }, [meQuery.data?.name])

  const updateName = useMutation({
    mutationFn: async () => {
      await authClient.updateUser({ name })
      await meQuery.refetch()
    },
  })

  const changePassword = useMutation({
    mutationFn: async () => {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })
      setCurrentPassword("")
      setNewPassword("")
    },
  })

  const deleteAccount = useMutation({
    mutationFn: async () => {
      await authClient.deleteUser({ password: deletePassword, callbackURL: "/" })
      // If deleteUser doesn't redirect automatically, force it.
      router.push("/")
    },
  })

  return (
    <div className="min-h-screen bg-[#0b0f14] text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px]">
        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#0f141b] px-4 py-6 lg:block">
          <div className="flex items-center justify-between px-2">
            <div>
              <p className="text-xs font-medium text-zinc-400">Dashboard</p>
              <h1 className="text-xl font-semibold tracking-tight">Viewify</h1>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-zinc-200">
              Beta
            </span>
          </div>

          <SideBar />
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0f14]/70 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <div>
                <p className="text-xs font-medium text-zinc-400">Viewify • Settings</p>
                <p className="text-base font-semibold">Account & preferences</p>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">
            {/* Theme */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
              <h2 className="text-base font-semibold">Appearance</h2>
              <p className="mt-1 text-sm text-zinc-300">Choose how Viewify looks for you.</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className={`rounded-xl border px-3 py-2 text-sm font-medium ${theme === "light" ? "border-white/20 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                  onClick={() => setTheme("light")}
                >
                  Light
                </button>
                <button
                  className={`rounded-xl border px-3 py-2 text-sm font-medium ${mounted && theme === "dark" ? "border-white/20 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                  onClick={() => setTheme("dark")}
                >
                  Dark
                </button>
                <button
                  className={`rounded-xl border px-3 py-2 text-sm font-medium ${mounted && theme === "system" ? "border-white/20 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                  onClick={() => setTheme("system")}
                >
                  System
                </button>
              </div>
            </section>

            {/* Profile */}
            <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
              <h2 className="text-base font-semibold">Profile</h2>
              <p className="mt-1 text-sm text-zinc-300">Update your account details.</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-200">Email</label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                    value={meQuery.data?.email ?? ""}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-200">Username</label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 disabled:opacity-60"
                  disabled={updateName.isPending || !name.trim()}
                  onClick={() => updateName.mutate()}
                >
                  {updateName.isPending ? "Saving…" : "Save changes"}
                </button>
              </div>
            </section>

            {/* Security */}
            <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
              <h2 className="text-base font-semibold">Security</h2>
              <p className="mt-1 text-sm text-zinc-300">Change your password.</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-200">Current password</label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-200">New password</label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 disabled:opacity-60"
                  disabled={
                    changePassword.isPending ||
                    currentPassword.length < 8 ||
                    newPassword.length < 8
                  }
                  onClick={() => changePassword.mutate()}
                >
                  {changePassword.isPending ? "Updating…" : "Update password"}
                </button>
              </div>
            </section>

            {/* Danger zone */}
            <section className="mt-6 rounded-2xl border border-rose-900/40 bg-rose-950/20 p-5 shadow-sm">
              <h2 className="text-base font-semibold text-rose-200">Danger zone</h2>
              <p className="mt-1 text-sm text-rose-200/80">
                Deleting your account is permanent and will remove your sessions.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-rose-200">Confirm password</label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-rose-900/60 bg-black/20 px-3 py-2 text-sm outline-none"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-60"
                  disabled={deleteAccount.isPending || deletePassword.length < 8}
                  onClick={() => {
                    // simple confirm (we can swap to shadcn AlertDialog next)
                    if (confirm("Delete your account? This cannot be undone.")) {
                      deleteAccount.mutate()
                    }
                  }}
                >
                  {deleteAccount.isPending ? "Deleting…" : "Delete account"}
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
