"use client";

import React from "react";
import SideBar from "@/components/sidebar";

type OrderRow = {
  orderNumber: string;
  customerName: string;
  orderedAt: string;
  total: string;
  status: "Paid" | "Pending" | "Refunded";
  channel: "Online Store" | "Draft" | "POS";
};

function StatusPill({ status }: { status: OrderRow["status"] }) {
  const cls =
    status === "Paid"
      ? "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-900"
      : status === "Pending"
        ? "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900"
        : "bg-zinc-100 text-zinc-900 border-zinc-200 dark:bg-zinc-900/60 dark:text-zinc-200 dark:border-zinc-800";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}
    >
      {status}
    </span>
  );
}

export default function Page() {
  const orders: OrderRow[] = [
    {
      orderNumber: "#10492",
      customerName: "Avery Johnson",
      orderedAt: "Jan 8, 2026",
      total: "$129.00",
      status: "Paid",
      channel: "Online Store",
    },
    {
      orderNumber: "#10491",
      customerName: "Noah Chen",
      orderedAt: "Jan 8, 2026",
      total: "$74.00",
      status: "Pending",
      channel: "Online Store",
    },
    {
      orderNumber: "#10490",
      customerName: "Sophia Patel",
      orderedAt: "Jan 7, 2026",
      total: "$242.50",
      status: "Paid",
      channel: "POS",
    },
    {
      orderNumber: "#10489",
      customerName: "Ethan Nguyen",
      orderedAt: "Jan 7, 2026",
      total: "$19.99",
      status: "Refunded",
      channel: "Draft",
    },
  ];

  const totals = {
    total: orders.length,
    paid: orders.filter((o) => o.status === "Paid").length,
    pending: orders.filter((o) => o.status === "Pending").length,
    refunded: orders.filter((o) => o.status === "Refunded").length,
  };

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
                <p className="text-xs font-medium text-muted-foreground">Viewify • Orders</p>
                <p className="text-base font-semibold">Orders dashboard</p>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">
            {/* KPI cards */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total orders", value: String(totals.total) },
                { label: "Paid", value: String(totals.paid) },
                { label: "Pending", value: String(totals.pending) },
                { label: "Refunded", value: String(totals.refunded) },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{kpi.value}</p>
                </div>
              ))}
            </section>

            <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">Recent orders</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Dummy data for now — wired to the new Prisma `Order` model later.
                  </p>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="py-3 pr-4 font-medium">Order</th>
                      <th className="py-3 pr-4 font-medium">Customer</th>
                      <th className="py-3 pr-4 font-medium">Date</th>
                      <th className="py-3 pr-4 font-medium">Total</th>
                      <th className="py-3 pr-4 font-medium">Status</th>
                      <th className="py-3 pr-4 font-medium">Channel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((o) => (
                      <tr key={o.orderNumber} className="hover:bg-muted/40">
                        <td className="py-3 pr-4 font-medium text-foreground">
                          {o.orderNumber}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{o.customerName}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{o.orderedAt}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{o.total}</td>
                        <td className="py-3 pr-4">
                          <StatusPill status={o.status} />
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{o.channel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
