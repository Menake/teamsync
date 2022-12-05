import { useNavigation, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";
import { RouterOutput, trpc } from "../../utils/trpc";
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type FixtureDetails = RouterOutput["fixture"]["details"];

type TeamStats = NonNullable<FixtureDetails>["team"]["stats"];

function Stats({
  teamStats,
  oppositionStats,
}: {
  teamStats: TeamStats;
  oppositionStats: TeamStats;
}) {
  const TeamStats = ({ stats }: { stats: TeamStats }) => (
    <View>
      <Text className="h-12">wins: {stats?.wins}</Text>
      <Text className="h-12">losses: {stats?.losses}</Text>
      <Text className="h-12">draws: {stats?.draws}</Text>
      <Text className="h-12">points: {stats?.points.toString()}</Text>
    </View>
  );

  return (
    <View className="flex- h-full">
      <TeamStats stats={teamStats} />
      <TeamStats stats={oppositionStats} />
    </View>
  );
}

function Map() {
  return (
    <View className="h-32 bg-purple-600">
      <Text>Map</Text>
    </View>
  );
}

function Roster() {
  return (
    <View className="h-full flex-1 bg-purple-600">
      <Text>Roster</Text>
    </View>
  );
}

const TeamAvatar = ({ teamName }: { teamName: string | undefined }) => (
  <View className="w-18 flex items-center justify-center">
    <View className="h-14 w-14 rounded-full bg-purple-500" />
    <Text className="mt-2">{teamName}</Text>
  </View>
);

const Header = ({ fixture }: { fixture: FixtureDetails }) => {
  const navigation = useNavigation();

  if (!fixture) return null;
  return (
    <View className="rounded-3xlp-4 flex flex-col justify-between py-5">
      <Pressable
        className="left-4 top-6 z-10"
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          className="absolute z-10"
          name="ios-arrow-back-sharp"
          size={20}
        />
      </Pressable>
      <View>
        <Text className="text-center text-lg font-normal">
          {format(fixture.date, "EEEE do LLLL")}
        </Text>
        <Text className="text-center text-sm font-normal text-gray-400">
          {format(fixture.date, "HH:mm")}
        </Text>
      </View>
      {/* <View className="grow" /> */}
      <View className="flex h-32 w-full flex-none flex-row items-center justify-around">
        <TeamAvatar teamName={fixture.team.name} />
        <Text className="text-lg">vs</Text>
        <TeamAvatar teamName={fixture.opposition.name} />
      </View>
    </View>
  );
};

export const FixtureDetailsScreen = () => {
  const route: RouteProp<{ params: { detailsId: string } }, "params"> =
    useRoute();

  const { data, isLoading } = trpc.fixture.details.useQuery(
    route.params.detailsId,
  );

  if (isLoading) return null;

  return (
    <Tabs.Container
      renderTabBar={(props) => <MaterialTabBar {...props} activeColor="" />}
      renderHeader={() => <Header fixture={data} />}
    >
      <Tabs.Tab name="Stats">
        <Tabs.FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={[{}]}
          renderItem={() => (
            <Stats
              teamStats={data?.team.stats}
              oppositionStats={data?.opposition.stats}
            />
          )}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Map">
        <Tabs.FlatList data={[{}]} renderItem={() => <Map />} />
      </Tabs.Tab>
      <Tabs.Tab name="Roster">
        <Tabs.FlatList data={[{}]} renderItem={() => <Roster />} />
      </Tabs.Tab>
    </Tabs.Container>
  );
};
