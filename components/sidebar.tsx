"use client"
import { ChartNoAxesCombined, Folders, House, PackageSearch, Search, Settings } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";


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

  const pathname = usePathname()
  console.log("The pathname", pathname.includes(label.toLowerCase()))
  

  return (
    <button
      onClick={() => {router.push(route); active=true}}
      className={
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full " +
        (pathname.includes(label.toLowerCase())
          ? "bg-muted/70 text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground")
      }
    >
      <span
        className={
          "grid h-9 w-9 place-items-center rounded-md border " +
          (active
            ? "border-border bg-muted/70 text-foreground"
            : "border-border bg-background text-muted-foreground group-hover:bg-muted/60")
        }
      >
        <Icon name={icon} />
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}



const SideBar = () => {
  const params = useParams<{ id?: string }>()
  const id = params?.id

  // Keep the userId segment in every sidebar link.
  // If for some reason we're not on a route that includes [id], fall back
  // to the old non-dynamic routes.
  const withId = (path: string) => (id ? `${path}/${id}` : path)

  return (
    <nav className="mt-6 space-y-1 flex-4/12">
        <NavItem icon="home" label="Overview" route={withId("/overview")}/>
        <NavItem icon="orders" label="Orders" route={withId("/orders")} />
        <NavItem icon="products" label="Products" route={withId("/products")}/>
        <NavItem icon="analytics" label="Analytics" route={withId("/analytics")}/>
        <NavItem icon="settings" label="Settings" route={withId("/settings")} />
    </nav>
  )
}

export default SideBar
