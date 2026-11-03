import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

export default function AnimatedBackground() {
  return (
    <LinearGradient
      colors={["#FFFFFF", "#FCFCFC", "#F7F8FA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  );
}