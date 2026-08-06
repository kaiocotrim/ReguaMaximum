import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  async function handleLogout() {
    await SecureStore.deleteItemAsync("auth_token");
    await SecureStore.deleteItemAsync("auth_user");

    router.replace("/");
  }

  return (
    <View className="flex-1 items-center justify-center bg-[#F4F4F4] px-6">
      <StatusBar style="dark" />

      <Text className="text-3xl font-bold text-[#244C4E]">
        Régua Máxima
      </Text>

      <Text className="mt-2 text-center text-gray-500">
        Login realizado com sucesso.
      </Text>

      <Pressable
        onPress={handleLogout}
        className="mt-8 h-[58px] w-full items-center justify-center rounded-[24px] bg-[#C3F32C]"
      >
        <Text className="text-base font-bold text-[#244C4E]">
          Sair da conta
        </Text>
      </Pressable>
    </View>
  );
}