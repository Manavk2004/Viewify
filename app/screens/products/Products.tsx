"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  MoreHorizontal,
  Package,
  Plus,
  Search,
} from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Empty } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormDescription as RHFDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import SideBar from "@/components/sidebar"
import { listProducts } from "@/app/lib/productsPrisma/prisma"
import { workflowsRouter } from "@/trpc/products/routers"
import { trpc } from "@/trpc/server"
import { useTRPC } from "@/trpc/client"

type ProductStatus = "Active" | "Draft" | "Archived"

type ProductRow = {
  id: string
  title: string
  status: ProductStatus
  sku: string
  inventory: number
  price: number
  updatedAt: string
  image?: string
}

type ProductImage = {
  id: string
  file: File
  previewUrl: string
}

const DEMO_PRODUCTS: ProductRow[] = [
  {
    id: "prod_001",
    title: "Pulse Hoodie",
    status: "Active",
    sku: "PUL-HOOD-BLK-M",
    inventory: 42,
    price: 64.0,
    updatedAt: "Jan 8, 2026",
    image:
      "https://images.unsplash.com/photo-1520975869011-70bd64b00f8a?auto=format&fit=crop&w=120&q=60",
  },
  {
    id: "prod_002",
    title: "Everyday Tee",
    status: "Draft",
    sku: "PUL-TEE-WHT-L",
    inventory: 0,
    price: 28.0,
    updatedAt: "Jan 7, 2026",
    image:
      "https://images.unsplash.com/photo-1520975958224-7d0b45f7a4c2?auto=format&fit=crop&w=120&q=60",
  },
  {
    id: "prod_003",
    title: "Hydration Bottle",
    status: "Active",
    sku: "PUL-BTL-20OZ",
    inventory: 8,
    price: 22.0,
    updatedAt: "Jan 5, 2026",
    image:
      "https://images.unsplash.com/photo-1526401485004-2fda9f6a8f00?auto=format&fit=crop&w=120&q=60",
  },
  {
    id: "prod_004",
    title: "Canvas Tote",
    status: "Archived",
    sku: "PUL-TOTE-NAT",
    inventory: 0,
    price: 18.0,
    updatedAt: "Dec 22, 2025",
    image:
      "https://images.unsplash.com/photo-1585487000160-6d319a8b2f71?auto=format&fit=crop&w=120&q=60",
  },
]

function StatusBadge({ status }: { status: ProductStatus }) {
  const variant: React.ComponentProps<typeof Badge>["variant"] =
    status === "Active" ? "default" : status === "Draft" ? "secondary" : "outline"

  return (
    <Badge variant={variant} className="whitespace-nowrap">
      {status}
    </Badge>
  )
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

const createProductSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().max(2000).optional().or(z.literal("")),
  status: z.enum(["Active", "Draft"]),
  price: z.string(),
  compareAtPrice: z.number(),
  sku: z.string().optional(),
  trackInventory: z.boolean(),
  inventory: z.string(),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional().or(z.literal("")),
})

type CreateProductValues = z.infer<typeof createProductSchema>

function makeId(prefix: string) {
  // Avoid Math.random (can be flagged by strict lint rules). This is UI-only.
  return `${prefix}_${Date.now()}_${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : "id"}`
}

function todayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date())
}






export default function Products() {
  const [query, setQuery] = React.useState("")
  const [createOpen, setCreateOpen] = React.useState(false)
  const [images, setImages] = React.useState<ProductImage[]>([])
  const [rows, setRows] = React.useState<ProductRow[]>(DEMO_PRODUCTS)

  const trpc = useTRPC()

  const form = useForm<CreateProductValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "Draft",
      price: "0",
      compareAtPrice: 2,
      sku: "",
      trackInventory: true,
      inventory: "0",
      category: "Apparel",
      tags: "",
    },
  })

  const trackInventory = useWatch({ control: form.control, name: "trackInventory" })

  React.useEffect(() => {
    // Cleanup object URLs
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl))
    }
  }, [images])

  const onFiles = React.useCallback((fileList: FileList | null) => {
    if (!fileList) return
    const next = Array.from(fileList)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 10 - images.length)
      .map((file) => ({
        id: makeId("img"),
        file,
        previewUrl: URL.createObjectURL(file),
      }))

    setImages((prev) => [...prev, ...next])
  }, [images.length])

  function removeImage(id: string) {
    setImages((prev) => {
      const img = prev.find((p) => p.id === id)
      if (img) URL.revokeObjectURL(img.previewUrl)
      return prev.filter((p) => p.id !== id)
    })
  }

  function resetCreate() {
    form.reset()
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl))
    setImages([])
  }

  function submitCreate(values: CreateProductValues) {
    const image = images[0]?.previewUrl
    const newRow: ProductRow = {
      id: uuidv4(),
      title: values.title,
      status: values.status,
      sku: values.sku ? values.sku : "",
      inventory: values.trackInventory ? Number(values.inventory): 0,
      price: Number(values.price),
      updatedAt: todayLabel(),
      image,
    }
    console.log(newRow)
    setRows((prev) => [newRow, ...prev])
    setCreateOpen(false)
    resetCreate()
  }

  const products = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((p) =>
      [p.title, p.sku, p.status].some((v) => v.toLowerCase().includes(q))
    )
  }, [query, rows])

  const totals = React.useMemo(() => {
    const total = rows.length
    const active = rows.filter((p) => p.status === "Active").length
    const draft = rows.filter((p) => p.status === "Draft").length
    const lowStock = rows.filter(
      (p) => p.status !== "Archived" && p.inventory > 0 && p.inventory <= 10
    ).length
    return { total, active, draft, lowStock }
  }, [rows])

  const hasNoProducts = rows.length === 0
  const hasNoResults = !hasNoProducts && products.length === 0


  const getProducts = () => {
    const theString = trpc.products.getMany()
  }



  return (
    <div className="min-h-screen bg-background flex">
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
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Products</p>
            <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/">
                Back to dashboard <ArrowUpRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Dialog open={createOpen} onOpenChange={() => setCreateOpen(true)}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 size-4" />
                  Create product
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Create product</DialogTitle>
                  <DialogDescription>
                    Add details, pricing, inventory, and images. (UI only)
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(submitCreate)}
                    className="grid gap-6"
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Left column */}
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Pulse Hoodie" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Write a short description that will show on the product page."
                                  className="min-h-28"
                                  {...field}
                                />
                              </FormControl>
                              <RHFDescription>
                                Tip: include materials, sizing, and care instructions.
                              </RHFDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Media</p>
                              <p className="text-sm text-muted-foreground">
                                Upload up to 10 images.
                              </p>
                            </div>
                            <Badge variant="secondary">{images.length}/10</Badge>
                          </div>

                          <label
                            className="group grid cursor-pointer place-items-center gap-2 rounded-lg border border-dashed bg-muted/20 p-6 text-center hover:bg-muted/30"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault()
                              onFiles(e.dataTransfer.files)
                            }}
                          >
                            <Package className="size-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Drag and drop images</p>
                              <p className="text-sm text-muted-foreground">
                                or click to upload
                              </p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="sr-only"
                              onChange={(e) => onFiles(e.target.files)}
                            />
                          </label>

                          {images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                              {images.map((img) => (
                                <div
                                  key={img.id}
                                  className="group relative overflow-hidden rounded-md border bg-muted"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={img.previewUrl}
                                    alt={img.file.name}
                                    className="h-20 w-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(img.id)}
                                    className="absolute right-1 top-1 rounded-md bg-background/80 px-2 py-1 text-xs opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right column */}
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Draft">Draft</SelectItem>
                                  <SelectItem value="Active">Active</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="compareAtPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Compare-at</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Optional"
                                    {...field}
                                  />
                                </FormControl>
                                <RHFDescription>Shows a “sale” price.</RHFDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="sku"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SKU</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. PUL-HOOD-BLK-M" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Inventory</p>
                              <p className="text-sm text-muted-foreground">
                                Track quantity for this product.
                              </p>
                            </div>
                            <FormField
                              control={form.control}
                              name="trackInventory"
                              render={({ field }) => (
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name="inventory"
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Quantity</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      disabled={!trackInventory}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input placeholder="Apparel" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tags"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tags</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="hoodie, winter, unisex"
                                  {...field}
                                />
                              </FormControl>
                              <RHFDescription>
                                Comma-separated. Helps search & organization.
                              </RHFDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCreateOpen(false)
                          resetCreate()
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Create product</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* KPI cards */}
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardDescription>Total products</CardDescription>
              <CardTitle className="text-2xl">{totals.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="space-y-1">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-2xl">{totals.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="space-y-1">
              <CardDescription>Draft</CardDescription>
              <CardTitle className="text-2xl">{totals.draft}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="space-y-1">
              <CardDescription>Low stock</CardDescription>
              <CardTitle className="text-2xl">{totals.lowStock}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Table + controls */}
        <Card className="mt-6">
          <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All products</CardTitle>
              <CardDescription>
                A snapshot of your catalog. (UI only — no database yet.)
              </CardDescription>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[320px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title, SKU, status…"
                  className="pl-9"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" onClick={getProducts}>Sort</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Recently updated</DropdownMenuItem>
                  <DropdownMenuItem>Inventory (low → high)</DropdownMenuItem>
                  <DropdownMenuItem>Price (low → high)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent>
            {hasNoProducts ? (
              <div className="py-10">
                <Empty
                  icon={Package}
                  title="No products yet"
                  description="Create your first product to start selling."
                  action={
                    <Button>
                      <Plus className="mr-2 size-4" />
                      Create product
                    </Button>
                  }
                />
              </div>
            ) : hasNoResults ? (
              <div className="py-10">
                <Empty
                  icon={Search}
                  title="No matching products"
                  description="Try a different keyword or clear your search."
                  action={
                    <Button variant="outline" onClick={() => setQuery("")}>
                      Clear search
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[320px]">Product</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Inventory</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Created</TableHead>
                      <TableHead className="w-0" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="size-10 overflow-hidden rounded-md border bg-muted">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={
                                  p.image ??
                                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&q=60"
                                }
                                alt={p.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium">{p.title}</p>
                              <p className="truncate text-sm text-muted-foreground">
                                {p.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={p.status} />
                        </TableCell>
                        <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {p.inventory}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatUsd(p.price)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {p.updatedAt}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuItem>Archive</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
