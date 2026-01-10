import prisma from "@/app/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  me: baseProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return null;
    return prisma.user.findUnique({
      where: { id: ctx.userId },
      select: { id: true, name: true, email: true, emailVerified: true },
    });
  }),
});

