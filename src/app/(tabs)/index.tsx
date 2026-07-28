import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Link href={"/onboarding"}>onboarding</Link>
      <Link href="/(auth)/sign-in">sign-in</Link>
      <Link href="/(auth)/sign-up">sign-up</Link>
      <Link href="/subscriptions">subscriptions</Link>
      <Link href={{ pathname: "/subscriptions/[id]", params: { id: "claude" } }}>subscription details</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
