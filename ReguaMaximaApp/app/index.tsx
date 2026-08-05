import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import type { ComponentProps } from "react";
import { useState } from "react";

import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

type FontAwesomeName = ComponentProps<typeof FontAwesome>["name"];

type SocialButtonProps = {
  icon: FontAwesomeName;
  iconColor?: string;
  label: string;
};

function SocialButton({ icon, iconColor, label }: SocialButtonProps) {
  return (
    <Pressable
      onPress={() =>
        Alert.alert(
          label,
          "A autenticação social será configurada posteriormente.",
        )
      }
      className="h-14 w-full flex-row items-center rounded-[24px] bg-[#C3F32C] px-5 active:opacity-70"
    >
      <View className="w-7 items-start justify-center">
        <FontAwesome name={icon} size={21} color={iconColor || "#FFFFFF"} />
      </View>

      <Text className="flex-1 text-center text-[15px] font-semibold text-[#244c4e]">
        {label}
      </Text>

      <View className="w-7" />
    </Pressable>
  );
}

export default function Index() {
  const insets = useSafeAreaInsets();
  const [identifier, setIdentifier] = useState("");

  function handleContinue() {
    const value = identifier.trim();

    if (!value) {
      Alert.alert(
        "Campo obrigatório",
        "Digite seu e-mail ou nome de usuário.",
      );
      return;
    }

    Alert.alert("Continuar", `Login com: ${value}`);
  }

  return (
    <View className="flex-1 bg-[#F4F4F4]">
      <StatusBar style="light" />

      <KeyboardAvoidingView
        className="flex-1 bg-[#F4F4F4]"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 bg-[#F4F4F4]"
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center bg-[#F4F4F4] px-6 py-8">
            <View className="w-full max-w-[420px] self-center">
              <Image
                source={{
                  uri: "https://reguamaxima.cotrimdev.com.br/logoPretoBrancoFundoOFF.png",
                }}
                resizeMode="contain"
                className="mb-8 h-[72px] w-[210px] self-center"
              />

              <Text className="mb-8 text-center text-[29px] font-bold text-[#244c4e]">
                Entre na sua conta
              </Text>

              <View className="gap-3">
                <SocialButton
                  icon="google"
                  iconColor="#244c4e"
                  label="Continuar com Google"
                />

                <SocialButton
                  icon="facebook"
                  iconColor="#244c4e"
                  label="Continuar com Facebook"
                />

                <SocialButton
                  icon="apple"
                  iconColor="#244c4e" 
                  label="Continuar com Apple"
                />

                <SocialButton
                  icon="github"
                  iconColor="#244c4e"
                  label="Continuar com GitHub"
                />
              </View>

              <View className="my-7 flex-row items-center gap-4">
                <View className="h-px flex-1 bg-gray-500" />

                <Text className="text-sm text-gray-500">
                  ou
                </Text>

                <View className="h-px flex-1 bg-gray-500" />
              </View>

              <Text className="mb-2 text-sm font-medium text-gray-500">
                E-mail ou nome de usuário
              </Text>

              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="E-mail ou nome de usuário"
                placeholderTextColor="#244c4e"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="done"
                selectionColor="black"
                onSubmitEditing={handleContinue}
                className="h-[58px] w-full rounded-2xl border border-[#F4F4F4] bg-white   px-[18px] text-base text-[#244c4e] placeholder:text-gray-500 focus:border-[#C3F32C] focus:ring-1 focus:ring-[#C3F32C]"
              />

              <Pressable
                onPress={handleContinue}
                className="mt-3.5 h-[58px] w-full items-center justify-center rounded-[24px] bg-[#C3F32C]  active:opacity-80"
              >
                <Text className="text-base font-extrabold text-[#244c4e]">
                  Continuar
                </Text>
              </Pressable>
              
              <View className="mt-7 flex-row items-center justify-center gap-1.5">
                <Text className="text-sm text-[#244c4e]">
                  Não tem uma conta?
                </Text>

                <Pressable
                  onPress={() =>
                    Alert.alert(
                      "Cadastro",
                      "A tela de cadastro será criada posteriormente.",
                    )
                  }
                >
                  <Text className="text-sm font-bold text-[#C3F32C]">
                    Cadastre-se
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}