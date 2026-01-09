"use client"
import SideBar from '@/components/sidebar';
import { Search } from 'lucide-react';

type KPI = {
  label: string;
  value: string;
  delta: string;
  deltaType: "up" | "down" | "flat";
};

type OrderRow = {
  id: string;
  customer: string;
  date: string;
  total: string;
  status: "Paid" | "Pending" | "Refunded";
  channel: "Online Store" | "Draft" | "POS";
};


function DeltaPill({ delta, deltaType }: Pick<KPI, "delta" | "deltaType">) {
  const color =
    deltaType === "up"
      ? "text-emerald-300 bg-emerald-950/50 border-emerald-900"
      : deltaType === "down"
        ? "text-rose-300 bg-rose-950/50 border-rose-900"
        : "text-zinc-300 bg-zinc-900/60 border-zinc-800";
  const arrow = deltaType === "up" ? "▲" : deltaType === "down" ? "▼" : "•";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${color}`}
    >
      <span aria-hidden>{arrow}</span>
      {delta}
    </span>
  );
}

function StatusPill({ status }: { status: OrderRow["status"] }) {
  const cls =
    status === "Paid"
      ? "bg-emerald-950/50 text-emerald-200 border-emerald-900"
      : status === "Pending"
        ? "bg-amber-950/40 text-amber-200 border-amber-900"
        : "bg-zinc-900/60 text-zinc-200 border-zinc-800";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}
    >
      {status}
    </span>
  );
}


export default function Homepage() {



  const kpis: KPI[] = [
    { label: "Total sales", value: "$42,185.20", delta: "12.4%", deltaType: "up" },
    { label: "Orders", value: "1,284", delta: "3.1%", deltaType: "up" },
    { label: "Returning customers", value: "28%", delta: "1.2%", deltaType: "down" },
    { label: "Conversion rate", value: "2.41%", delta: "0.3%", deltaType: "flat" },
  ];

  const orders: OrderRow[] = [
    {
      id: "#10492",
      customer: "Avery Johnson",
      date: "Jan 8, 2026",
      total: "$129.00",
      status: "Paid",
      channel: "Online Store",
    },
    {
      id: "#10491",
      customer: "Noah Chen",
      date: "Jan 8, 2026",
      total: "$74.00",
      status: "Pending",
      channel: "Online Store",
    },
    {
      id: "#10490",
      customer: "Sophia Patel",
      date: "Jan 7, 2026",
      total: "$242.50",
      status: "Paid",
      channel: "POS",
    },
    {
      id: "#10489",
      customer: "Ethan Nguyen",
      date: "Jan 7, 2026",
      total: "$19.99",
      status: "Refunded",
      channel: "Draft",
    },
    {
      id: "#10488",
      customer: "Mia Garcia",
      date: "Jan 6, 2026",
      total: "$311.00",
      status: "Paid",
      channel: "Online Store",
    },
  ];

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

          <div className="mt-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4">
            <p className="text-sm font-semibold">Quick actions</p>
            <p className="mt-1 text-sm text-zinc-300">
              Jump back in where you left off.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium hover:bg-white/10">
                Create product
              </button>
              <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium hover:bg-white/10">
                Create discount
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0f14]/70 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white lg:hidden">
                  <span className="text-sm font-semibold">V</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-400">
                    Viewify • Overview
                  </p>
                  <p className="text-base font-semibold">Good evening</p>
                </div>
              </div>

              <div className="ml-auto flex w-full max-w-xl items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 shadow-sm">
                <Search className='size-4' />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-zinc-500"
                  placeholder="Search orders, products, customers…"
                  aria-label="Search"
                />
                <kbd className="hidden rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-600 sm:inline-block">
                  ⌘K
                </kbd>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium hover:bg-white/10">
                  Export
                </button>
                <button className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-200">
                  Create
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">
            {/* KPIs */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-300">
                        {kpi.label}
                      </p>
                      <p className="mt-1 text-2xl font-semibold tracking-tight">
                        {kpi.value}
                      </p>
                    </div>
                    <DeltaPill delta={kpi.delta} deltaType={kpi.deltaType} />
                  </div>
                  <p className="mt-3 text-sm text-zinc-400">
                    Compared to the previous 7 days
                  </p>
                </div>
              ))}
            </section>

            {/* Content grid */}
            <section className="mt-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold">Recent orders</h2>
                    <p className="mt-1 text-sm text-zinc-300">
                      A quick view of what’s happening today.
                    </p>
                  </div>
                  <a
                    href="#"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium hover:bg-white/10"
                  >
                    View all
                  </a>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                        <th className="py-3 pr-4 font-medium">Order</th>
                        <th className="py-3 pr-4 font-medium">Customer</th>
                        <th className="py-3 pr-4 font-medium">Date</th>
                        <th className="py-3 pr-4 font-medium">Total</th>
                        <th className="py-3 pr-4 font-medium">Status</th>
                        <th className="py-3 pr-4 font-medium">Channel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-white/5">
                          <td className="py-3 pr-4 font-medium text-zinc-100">
                            {o.id}
                          </td>
                          <td className="py-3 pr-4 text-zinc-200">
                            {o.customer}
                          </td>
                          <td className="py-3 pr-4 text-zinc-200">{o.date}</td>
                          <td className="py-3 pr-4 text-zinc-200">
                            {o.total}
                          </td>
                          <td className="py-3 pr-4">
                            <StatusPill status={o.status} />
                          </td>
                          <td className="py-3 pr-4 text-zinc-200">
                            {o.channel}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
                <h2 className="text-base font-semibold">To-dos</h2>
                <p className="mt-1 text-sm text-zinc-300">
                  Suggested tasks to keep the store healthy.
                </p>

                <div className="mt-4 space-y-3">
                  {[{
                    title: "Review pending payouts",
                    desc: "Check your last payout reconciliation.",
                  },
                  {
                    title: "Restock low inventory",
                    desc: "3 products are below the threshold.",
                  },
                  {
                    title: "Update theme",
                    desc: "A new version is available.",
                  }].map((t) => (
                    <div
                      key={t.title}
                      className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-sm font-semibold text-zinc-900">
                        {t.title}
                      </p>
                      <p className="mt-1 text-sm text-zinc-300">{t.desc}</p>
                      <div className="mt-3 flex gap-2">
                        <button className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-200">
                          Open
                        </button>
                        <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium hover:bg-white/10">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

