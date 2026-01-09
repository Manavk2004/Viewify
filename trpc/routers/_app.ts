import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { productsRouter } from '../products/routers';
export const appRouter = createTRPCRouter({
    products: productsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;