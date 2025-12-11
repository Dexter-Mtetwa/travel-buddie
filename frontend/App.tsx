import React from "react";
import { StatusBar } from "expo-status-bar";
import "react-native-get-random-values"; // for uuid
import { StyleSheet, Text, View } from "react-native";
import { useKeepAwake } from "expo-keep-awake"; // <-- import

export default function App() {
  useKeepAwake(); // keeps screen awake while this component is mounted

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
