import type { Availability } from ".prisma/client";
import { format } from "date-fns";
import React from "react";

import { Pressable, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { RouterOutput, trpc } from "../utils/trpc";

type Fixture = RouterOutput["fixture"]["upcoming"];

const TeamAvatar = ({ teamName }: { teamName: string | undefined }) => (
  <View className="w-18 flex items-center justify-center">
    <View className="h-16 w-16 rounded-full bg-purple-500" />
    <Text className="text mt-2 text-lg font-semibold text-white">
      {teamName}
    </Text>
  </View>
);

const FixtureCard = ({ fixture }: { fixture: Fixture }) => {
  if (!fixture) return null;

  return (
    <View className="flex h-full rounded-3xl bg-red-400 p-4 pt-8">
      <View className="h-32 flex-none">
        <Text className="text-4xl font-bold text-white">
          {format(fixture.date, "EEEE")}
        </Text>
        <Text className="text-3xl font-semibold text-white">
          {format(fixture.date, "do LLLL")}
        </Text>
      </View>
      <View className="grow" />
      <View className="flex h-40 w-full flex-none flex-row items-center justify-around">
        <TeamAvatar teamName={fixture.team} />
        <View className="-mt-3 flex">
          <Text className="text-xl font-bold text-white">
            {format(fixture.date, "HH:mm")}
          </Text>
          <Text className="font-semibold text-white">
            {fixture.location.name}
          </Text>
        </View>
        <TeamAvatar teamName={fixture.opposition} />
      </View>
    </View>
  );
};

const AvailabilityToggle = ({
  availability,
}: {
  availability: Availability | undefined;
}) => {
  return (
    <View className="mt-5 flex h-[10%] w-full flex-row">
      <Pressable
        className={`w-1/2 justify-center rounded-l-xl ${
          availability === "AVAILABLE" ? "bg-red-400" : "bg-gray-200"
        }`}
      >
        <Text
          className={`text-center ${
            availability === "AVAILABLE" ? "text-white" : ""
          } font-semibold`}
        >
          AVAILABLE
        </Text>
      </Pressable>
      <Pressable
        className={`w-1/2 justify-center rounded-r-xl ${
          availability === "UNAVAILABLE" ? "bg-red-400" : "bg-gray-200"
        }`}
      >
        <Text
          className={`text-center ${
            availability === "UNAVAILABLE" ? "text-white" : ""
          } font-semibold`}
        >
          UNAVAILABLE
        </Text>
      </Pressable>
    </View>
  );
};

export const HomeScreen = () => {
  const upcomingGameQuery = trpc.fixture.upcoming.useQuery();

  if (upcomingGameQuery.isLoading) return null;

  return (
    <SafeAreaView className="bg-gradient-to-b from-[#cf7785] to-[#c8554f]">
      <View className="h-full w-full p-4">
        {upcomingGameQuery.data && (
          <View className="flex-1">
            <View className="h-[55%]">
              <FixtureCard fixture={upcomingGameQuery.data}></FixtureCard>
            </View>
            <AvailabilityToggle
              availability={upcomingGameQuery.data.availability}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
