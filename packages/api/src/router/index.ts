import { router } from "../trpc";
import { fixtureRouter } from "./fixture";
import { authRouter } from "./auth";

export const appRouter = router({
  fixture: fixtureRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
