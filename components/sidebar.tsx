"use client"
import { ChartNoAxesCombined, Folders, House, PackageSearch, Search, Settings } from "lucide-react";
import { useRouter } from "next/navigation";


function Icon({ name, className }: { name: string; className?: string }) {
  // Simple inline icons to avoid extra dependencies.
  const common = "h-5 w-5";
  void common;
  void className;

  switch (name) {
    case "home":
      return (
        <House className='size-4' />
      );
    case "orders":
      return (
        <Folders className='size-4' />
      );
    case "products":
      return (
        <PackageSearch className='size-4' />
      );
    case "analytics":
      return (
        <ChartNoAxesCombined className='size-4' />
      );
    case "settings":
      return (
        <Settings className='size-4' />
      );
    case "search":
      return (
        <Search className='size-4' />
      );
    default:
      return null;
  }
}

function NavItem({
  icon,
  label,
  active,
  route
}: {
  icon: string;
  label: string;
  active?: boolean;
  route: string
}) {

  const router = useRouter()

  return (
    <button
      onClick={() => router.push(route)}
      className={
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full " +
        (active
          ? "bg-white/10 text-white"
          : "text-zinc-300 hover:bg-white/5 hover:text-white")
      }
    >
      <span
        className={
          "grid h-9 w-9 place-items-center rounded-md border " +
          (active
            ? "border-white/10 bg-white/10 text-white"
            : "border-white/10 bg-zinc-950 text-zinc-200 group-hover:bg-white/5")
        }
      >
        <Icon name={icon} />
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}



const SideBar = () => {
  return (
    <nav className="mt-6 space-y-1 border-white border-1 flex-4/12">
        <NavItem icon="home" label="Overview" active route="/homepage"/>
        <NavItem icon="orders" label="Orders" route='/orders' />
        <NavItem icon="products" label="Products" route='/products'/>
        <NavItem icon="analytics" label="Analytics" route='analytics'/>
        <NavItem icon="settings" label="Settings" route='settings' />
    </nav>
  )
}

export default SideBar
