import { Link } from "expo-router";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

const settings = () => {
  return (
    <SafeAreaView>
      <Text>Settings</Text>
    </SafeAreaView>
  );
};

export default settings;
