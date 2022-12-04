import { Availability } from ".prisma/client";
import { format } from "date-fns";
import React, { useState } from "react";

import { Pressable, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { RouterOutput, trpc } from "../utils/trpc";

type Fixture = RouterOutput["fixture"]["upcoming"];
type FixtureResult = RouterOutput["fixture"]["recent"][number];

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
  fixtureDetailsId,
}: {
  availability: Availability | undefined;
  fixtureDetailsId: string;
}) => {
  const [status, setStatus] = useState(availability);
  const setStatusMutation = trpc.fixture.setAvailability.useMutation();

  const updateStatus = async (newStatus: Availability) => {
    setStatus(newStatus === status ? "UNKNOWN" : newStatus);
    await setStatusMutation.mutateAsync({
      fixtureDetailsId,
      availability: newStatus === status ? "UNKNOWN" : newStatus,
    });
  };

  return (
    <View className="mt-5 flex h-[10%] w-full flex-row">
      <Pressable
        className={`w-1/2 justify-center rounded-l-xl ${
          status === "AVAILABLE" ? "bg-red-400" : "bg-gray-200"
        }`}
        onPress={() => updateStatus("AVAILABLE")}
      >
        <Text
          className={`text-center ${
            status === "AVAILABLE" ? "text-white" : ""
          } font-semibold`}
        >
          AVAILABLE
        </Text>
      </Pressable>
      <Pressable
        className={`w-1/2 justify-center rounded-r-xl ${
          status === "UNAVAILABLE" ? "bg-red-400" : "bg-gray-200"
        }`}
        onPress={() => updateStatus("UNAVAILABLE")}
      >
        <Text
          className={`text-center ${
            status === "UNAVAILABLE" ? "text-white" : ""
          } font-semibold`}
        >
          UNAVAILABLE
        </Text>
      </Pressable>
    </View>
  );
};

const RecentResult = ({ result }: { result: FixtureResult }) => (
  <View className="my-3">
    <Text className="text-xs text-[#cf7785]">
      {format(result.date, "dd/MM/yyyy")}
    </Text>
    <View className="flex flex-row items-center">
      <Text className="flex grow">{result.team.name}</Text>
      <View className="h-8 w-8 rounded-full bg-purple-500" />
      <Text className="mx-3 flex">
        {result.team.score} - {result.opposition.score}
      </Text>
      <View className="h-8 w-8 rounded-full bg-purple-500" />
      <Text className="flex grow text-right">{result.opposition.name}</Text>
    </View>
  </View>
);

export const HomeScreen = () => {
  const upcomingGameQuery = trpc.fixture.upcoming.useQuery();
  const recentFixtureResults = trpc.fixture.recent.useQuery(3);

  if (upcomingGameQuery.isLoading || recentFixtureResults.isLoading)
    return null;

  return (
    <SafeAreaView className="bg-gradient-to-b from-[#cf7785] to-[#c8554f]">
      <View className="h-full w-full p-4">
        {upcomingGameQuery.data && (
          <View className="flex-1">
            <View className="h-[50%]">
              <FixtureCard fixture={upcomingGameQuery.data}></FixtureCard>
            </View>
            <AvailabilityToggle
              fixtureDetailsId={upcomingGameQuery.data.detailsId}
              availability={upcomingGameQuery.data.availability}
            />
            <Text className="mt-5 mb-2 text-[#cf7785]">Recent Results</Text>
            <View className="flex-1">
              {recentFixtureResults.data?.map((result) => (
                <RecentResult key={result.id} result={result} />
              ))}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
