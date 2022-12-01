import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const fixtureRouter = router({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.fixture.findMany();
  }),
  byId: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.fixture.findFirst({ where: { id: input } });
  }),
  upcoming: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: {
        email: ctx.user,
      },
      include: {
        rosters: {
          select: {
            fixtureDetailId: true,
            availability: true,
          },
        },
      },
    });

    const team = await ctx.prisma.team.findFirstOrThrow({
      where: {
        id: user.activeTeamId ?? undefined,
      },
      include: {
        fixtures: {
          include: {
            participatingTeams: {
              select: { id: true, name: true },
            },
            location: true,
            details: {
              select: { id: true, teamId: true },
            },
          },
        },
      },
    });

    const currentDate = new Date();
    const upcoming = team.fixtures
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .filter((game) => game.date > currentDate)[0];

    if (!upcoming) return null;

    const detailsForTeam = upcoming.details.find(
      (details) => details.teamId === team.id,
    );

    const availability = user.rosters.find(
      (roster) => roster.fixtureDetailId == detailsForTeam?.id,
    )?.availability;

    const homeTeam = upcoming.participatingTeams.filter(
      (team) => team.id === user.activeTeamId,
    )[0];

    const opposition = upcoming.participatingTeams.filter(
      (team) => team.id !== user.activeTeamId,
    )[0];

    return {
      id: upcoming.id,
      date: upcoming.date,
      team: homeTeam?.name,
      opposition: opposition?.name,
      location: upcoming.location,
      availability,
    };
  }),
  recent: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: {
        email: ctx.user,
      },
    });

    const team = await ctx.prisma.team.findFirstOrThrow({
      where: {
        id: user.activeTeamId ?? undefined,
      },
      include: {
        fixtures: {
          include: {
            participatingTeams: true,
            scores: true,
          },
        },
      },
    });

    const currentDate = new Date();
    const previousGames = team.fixtures
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .filter((game) => game.date < currentDate);

    return previousGames.slice(0, input).map((game) => {
      const team = game.participatingTeams.filter(
        (team) => team.id === user.activeTeamId,
      )[0];

      const opposition = game.participatingTeams.filter(
        (team) => team.id !== user.activeTeamId,
      )[0];

      const teamScore = game.scores.filter(
        (score) => score.teamId === user.activeTeamId,
      )[0];
      const oppositionScore = game.scores.filter(
        (score) => score.teamId !== user.activeTeamId,
      )[0];

      return {
        id: game.id,
        team: { name: team?.name, score: teamScore?.score },
        opposition: { name: opposition?.name, score: oppositionScore?.score },
        date: game.date,
      };
    });
  }),
});
