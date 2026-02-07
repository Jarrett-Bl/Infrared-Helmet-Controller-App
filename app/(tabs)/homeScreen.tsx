import { AppColors } from "@/constants/theme";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/sharedStyles";

export default function titleScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={[styles.title, { marginTop: 16 }]}>
        IR Helmet Controller
      </Text>
      <View style={styles.center}>
        <Image
          source={require("../../assets/images/helmet-icon.png")}
          style={{ width: 300, height: 300, margin: 60 }}
        />
      </View>
      <View style={styles.center}>
        <Pressable
          onPress={() => router.push("/bluetoothPage1")}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: AppColors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[styles.buttonLabel]}>
            Tap Here to Begin
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

