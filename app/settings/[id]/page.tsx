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
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px]">
        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-border bg-card px-4 py-6 lg:block">
          <div className="flex items-center justify-between px-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Dashboard</p>
              <h1 className="text-xl font-semibold tracking-tight">Viewify</h1>
            </div>
            <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
              Beta
            </span>
          </div>

          <SideBar />
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-border/80 bg-background/80 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Viewify • Settings</p>
                <p className="text-base font-semibold">Account & preferences</p>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">
            {/* Theme */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-base font-semibold">Appearance</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose how Viewify looks for you.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className={`rounded-xl border px-3 py-2 text-sm font-medium ${mounted && theme === "light" ? "border-border bg-muted" : "border-border bg-background hover:bg-muted/60"}`}
                  onClick={() => setTheme("light")}
                >
                  Light
                </button>
                <button
                  className={`rounded-xl border px-3 py-2 text-sm font-medium ${mounted && theme === "dark" ? "border-border bg-muted" : "border-border bg-background hover:bg-muted/60"}`}
                  onClick={() => setTheme("dark")}
                >
                  Dark
                </button>
                <button
                  className={`rounded-xl border px-3 py-2 text-sm font-medium ${mounted && theme === "system" ? "border-border bg-muted" : "border-border bg-background hover:bg-muted/60"}`}
                  onClick={() => setTheme("system")}
                >
                  System
                </button>
              </div>
            </section>

            {/* Profile */}
            <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-base font-semibold">Profile</h2>
              <p className="mt-1 text-sm text-muted-foreground">Update your account details.</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                    value={meQuery.data?.email ?? ""}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Username</label>
                  <input
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="rounded-xl bg-foreground px-3 py-2 text-sm font-semibold text-background hover:bg-foreground/90 disabled:opacity-60"
                  disabled={updateName.isPending || !name.trim()}
                  onClick={() => updateName.mutate()}
                >
                  {updateName.isPending ? "Saving…" : "Save changes"}
                </button>
              </div>
            </section>

            {/* Security */}
            <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-base font-semibold">Security</h2>
              <p className="mt-1 text-sm text-muted-foreground">Change your password.</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Current password</label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">New password</label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="rounded-xl bg-foreground px-3 py-2 text-sm font-semibold text-background hover:bg-foreground/90 disabled:opacity-60"
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
            <section className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-5 shadow-sm">
              <h2 className="text-base font-semibold text-destructive">Danger zone</h2>
              <p className="mt-1 text-sm text-destructive/80">
                Deleting your account is permanent and will remove your sessions.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-destructive">Confirm password</label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-destructive/50 bg-background px-3 py-2 text-sm text-foreground outline-none"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="rounded-xl bg-destructive px-3 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-60"
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
