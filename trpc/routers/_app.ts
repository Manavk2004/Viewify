import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { productsRouter } from '../products/routers';
import { emailRouter } from '../email/routers';
export const appRouter = createTRPCRouter({
    products: productsRouter,
    email: emailRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
