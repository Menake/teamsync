import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const postQuery = trpc.post.all.useQuery();

  return (
    <>
      <Head>
        <title>Teamsync</title>
        <meta name="description" content="Teamsync web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Teamsync
          </h1>
        </div>
      </main>
    </>
  );
};

export default Home;
