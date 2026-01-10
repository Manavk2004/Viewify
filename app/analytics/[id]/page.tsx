"use client";

import React from "react";
import SideBar from "@/components/sidebar";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RevenuePoint = {
  month: string;
  revenue: number;
};

type ProductSalesPoint = {
  month: string;
  hoodies: number;
  tees: number;
  accessories: number;
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Page() {
  // Dummy data (replace later with DB-powered analytics)
  const revenue: RevenuePoint[] = [
    { month: "Aug", revenue: 22000 },
    { month: "Sep", revenue: 26500 },
    { month: "Oct", revenue: 30100 },
    { month: "Nov", revenue: 35800 },
    { month: "Dec", revenue: 41200 },
    { month: "Jan", revenue: 45150 },
  ];

  const productSales: ProductSalesPoint[] = [
    { month: "Aug", hoodies: 120, tees: 210, accessories: 90 },
    { month: "Sep", hoodies: 140, tees: 240, accessories: 110 },
    { month: "Oct", hoodies: 165, tees: 260, accessories: 120 },
    { month: "Nov", hoodies: 190, tees: 310, accessories: 150 },
    { month: "Dec", hoodies: 220, tees: 340, accessories: 175 },
    { month: "Jan", hoodies: 205, tees: 320, accessories: 160 },
  ];

  const lastMonthRevenue = revenue.at(-2)?.revenue ?? 0;
  const currentRevenue = revenue.at(-1)?.revenue ?? 0;
  const revenueDeltaPct = lastMonthRevenue
    ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : 0;

  const kpis = [
    { label: "Revenue (MTD)", value: formatUsd(currentRevenue), sub: `${revenueDeltaPct.toFixed(1)}% vs last month` },
    { label: "Orders", value: "1,284", sub: "3.1% vs last month" },
    { label: "AOV", value: "$68", sub: "-1.4% vs last month" },
    { label: "Refund rate", value: "1.8%", sub: "-0.2% vs last month" },
    { label: "Conversion", value: "2.41%", sub: "+0.3% vs last month" },
    { label: "Returning customers", value: "28%", sub: "-1.2% vs last month" },
  ];

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
                <p className="text-xs font-medium text-muted-foreground">Viewify • Analytics</p>
                <p className="text-base font-semibold">Company performance</p>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">
            {/* KPI cards */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{kpi.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{kpi.sub}</p>
                </div>
              ))}
            </section>

            {/* Charts */}
            <section className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold">Revenue over time</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Last 6 months (dummy data)</p>
                  </div>
                </div>

                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenue} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
                      <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                      <YAxis
                        stroke="var(--muted-foreground)"
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                        labelStyle={{ color: "var(--foreground)" }}
                        formatter={(value) => [formatUsd(Number(value)), "Revenue"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#818cf8"
                        fill="url(#revFill)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div>
                  <h2 className="text-base font-semibold">Product sales over time</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Units sold by category (dummy data)</p>
                </div>

                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productSales} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
                      <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                        labelStyle={{ color: "var(--foreground)" }}
                      />
                      <Bar dataKey="hoodies" stackId="a" fill="#34d399" />
                      <Bar dataKey="tees" stackId="a" fill="#60a5fa" />
                      <Bar dataKey="accessories" stackId="a" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-2 py-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> Hoodies
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-2 py-1">
                    <span className="h-2 w-2 rounded-full bg-blue-400" /> Tees
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-2 py-1">
                    <span className="h-2 w-2 rounded-full bg-amber-400" /> Accessories
                  </span>
                </div>
              </div>
            </section>

            {/* Operational insights */}
            <section className="mt-6 grid gap-4 lg:grid-cols-3">
              {[
                {
                  title: "Top channels",
                  rows: [
                    { label: "Online Store", value: "72%" },
                    { label: "POS", value: "21%" },
                    { label: "Draft", value: "7%" },
                  ],
                },
                {
                  title: "Top products",
                  rows: [
                    { label: "Pulse Hoodie", value: "$14.2k" },
                    { label: "Everyday Tee", value: "$9.6k" },
                    { label: "Hydration Bottle", value: "$4.1k" },
                  ],
                },
                {
                  title: "Customer health",
                  rows: [
                    { label: "New customers", value: "384" },
                    { label: "Returning", value: "28%" },
                    { label: "Churn risk", value: "Low" },
                  ],
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <h3 className="text-base font-semibold">{card.title}</h3>
                  <div className="mt-4 space-y-3">
                    {card.rows.map((r) => (
                      <div key={r.label} className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">{r.label}</p>
                        <p className="text-sm font-semibold text-foreground">{r.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
