import prisma from "@/app/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";


export const productsRouter = createTRPCRouter({
    getMany: baseProcedure.query(({ ctx }) => {
        const items = prisma.products.findMany({
            where: {
                id: ct
            }
        })
    })
})
