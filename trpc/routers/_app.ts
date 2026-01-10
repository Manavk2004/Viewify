import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { productsRouter } from '../products/routers';
import { emailRouter } from '../email/routers';
import { userRouter } from '../user/routers';
export const appRouter = createTRPCRouter({
    products: productsRouter,
    email: emailRouter,
    user: userRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
