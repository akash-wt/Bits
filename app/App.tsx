import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { connectWalletAndVerifyNonce,  } from "./solana/connectWalletAndVerfiyNonce";


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start on your app!</Text>

      <Button  title="signin nonce" onPress={connectWalletAndVerifyNonce}></Button>

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
    marginBottom: 20,
  },
  button:{
    height:4,
    width:4,
    backgroundColor:"black",
    color:"white"
  }
});
