import { useNavigation, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialTabBar, Tab, Tabs } from "react-native-collapsible-tab-view";
import { RouterOutput, trpc } from "../../utils/trpc";
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import openMap from "react-native-open-maps";

type FixtureDetails = RouterOutput["fixture"]["details"];

type TeamStats = NonNullable<FixtureDetails>["team"]["stats"];
type FixtureLocation = NonNullable<FixtureDetails>["location"];

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

function Map({ location }: { location: FixtureLocation | undefined }) {
  if (!location) return null;

  return (
    <View className="mt-2 h-[75%] p-5">
      <Pressable
        className="flex flex-row items-center justify-between"
        onPress={() =>
          openMap({
            latitude: location.latitude,
            longitude: location.longitude,
            query: location.address,
            end: location.address,
          })
        }
      >
        <View>
          <Text className="text-lg font-medium">{location.name}</Text>
          <Text className=" text-xs text-gray-500">{location.address}</Text>
        </View>
        <View className="mt-3 h-6 w-6 items-center justify-center rounded-full bg-gray-200">
          <Ionicons size={13} name="ios-location-outline" />
        </View>
      </Pressable>
      <MapView
        className="mt-5"
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.04,
        }}
        style={{ flex: 1, borderRadius: 20 }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={location.name}
          description={location.address}
        />
      </MapView>
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
      renderTabBar={(props) => <MaterialTabBar {...props} />}
      renderHeader={() => <Header fixture={data} />}
    >
      <Tabs.Tab name="Map">
        <Tabs.FlatList
          data={[{}]}
          renderItem={() => <Map location={data?.location} />}
        />
      </Tabs.Tab>
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

      <Tabs.Tab name="Roster">
        <Tabs.FlatList data={[{}]} renderItem={() => <Roster />} />
      </Tabs.Tab>
    </Tabs.Container>
  );
};
