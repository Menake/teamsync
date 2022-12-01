import { prisma, User } from "@teamsync/db";
import { type inferAsyncReturnType } from "@trpc/server";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = {
  user: string | undefined;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    user: opts.user,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async () => {
  const user = "test";

  return await createContextInner({
    user,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
