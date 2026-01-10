import prisma from "@/app/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";


export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      return prisma.products.findMany({
        where: input.userId ? { userId: input.userId } : undefined,
        orderBy: { createdAt: "desc" },
      });
    }),

  create: baseProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        title: z.string().min(2),
        description: z.string(),
        status: z.enum(["Active", "Draft"]),
        price: z.string(),
        compareAtPrice: z.number().int(),
        sku: z.string().optional(),
        trackInventory: z.boolean(),
        inventory: z.string(),
        category: z.string(),
        tags: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.products.create({
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          price: input.price,
          compareAtPrice: input.compareAtPrice,
          Sku: input.sku,
          trackInventory: input.trackInventory,
          Inventory: input.inventory,
          Category: input.category,
          Tags: input.tags,
          userId: input.userId,
        },
      });
    }),
})
