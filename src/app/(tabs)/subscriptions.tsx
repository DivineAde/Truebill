import { Link } from "expo-router";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

const subscriptions = () => {
  return (
    <SafeAreaView>
      <Text>Subscription</Text>
    </SafeAreaView>
  );
};

export default subscriptions;
