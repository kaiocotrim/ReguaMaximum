import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { ComponentProps } from "react";
import { useRef, useState } from "react";

import {
  ActivityIndicator,
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

import { loginWithEmail } from "../services/auth";

type FontAwesomeName = ComponentProps<typeof FontAwesome>["name"];

type SocialButtonProps = {
  icon: FontAwesomeName;
  iconColor?: string;
  label: string;
};

function SocialButton({
  icon,
  iconColor = "#244C4E",
  label,
}: SocialButtonProps) {
  function handleSocialLogin() {
    Alert.alert(
      label,
      "A autenticação social será configurada posteriormente.",
    );
  }

  return (
    <Pressable
      onPress={handleSocialLogin}
      className="h-14 w-full flex-row items-center rounded-[24px] bg-[#C3F32C] px-5 active:opacity-70"
    >
      <View className="w-7 items-start justify-center">
        <FontAwesome
          name={icon}
          size={21}
          color={iconColor}
        />
      </View>

      <Text className="flex-1 text-center text-[15px] font-semibold text-[#244C4E]">
        {label}
      </Text>

      <View className="w-7" />
    </Pressable>
  );
}

export default function Index() {
  const insets = useSafeAreaInsets();
  const passwordInputRef = useRef<TextInput>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleContinue() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert(
        "Campos obrigatórios",
        "Digite seu e-mail e sua senha.",
      );

      return;
    }

    if (!normalizedEmail.includes("@")) {
      Alert.alert(
        "E-mail inválido",
        "Digite um endereço de e-mail válido.",
      );

      return;
    }

    try {
      setIsLoading(true);

      await loginWithEmail(
        normalizedEmail,
        password,
      );

      router.replace("/home");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível realizar o login.";

      Alert.alert(
        "Erro ao entrar",
        message,
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleRegister() {
    router.push("/cadastro");
  }

  function handleForgotPassword() {
    router.push("/esqueci-senha");
  }

  return (
    <View className="flex-1 bg-[#F4F4F4]">
      <StatusBar style="dark" />

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

              <Text className="mb-8 text-center text-[29px] font-bold tracking-[-0.7px] text-[#244C4E]">
                Entre na sua conta
              </Text>

              <View className="gap-3">
                <SocialButton
                  icon="google"
                  label="Continuar com Google"
                />

                <SocialButton
                  icon="facebook"
                  label="Continuar com Facebook"
                />

                <SocialButton
                  icon="apple"
                  label="Continuar com Apple"
                />

                <SocialButton
                  icon="github"
                  label="Continuar com GitHub"
                />
              </View>

              <View className="my-7 flex-row items-center gap-4">
                <View className="h-px flex-1 bg-gray-300" />

                <Text className="text-sm text-gray-500">
                  ou
                </Text>

                <View className="h-px flex-1 bg-gray-300" />
              </View>

              <Text className="mb-2 text-sm font-medium text-[#244C4E]">
                E-mail
              </Text>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                selectionColor="#244C4E"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
                editable={!isLoading}
                className="h-[58px] w-full rounded-2xl border border-gray-200 bg-white px-[18px] text-base text-[#244C4E]"
              />

              <View className="mb-2 mt-4 flex-row items-center justify-between">
                <Text className="text-sm font-medium text-[#244C4E]">
                  Senha
                </Text>

                <Pressable
                  onPress={handleForgotPassword}
                  disabled={isLoading}
                  className="active:opacity-60"
                >
                  <Text className="text-sm font-semibold text-[#244C4E]">
                    Esqueci minha senha
                  </Text>
                </Pressable>
              </View>

              <View className="h-[58px] w-full flex-row items-center rounded-2xl border border-gray-200 bg-white px-[18px]">
                <TextInput
                  ref={passwordInputRef}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  selectionColor="#244C4E"
                  onSubmitEditing={handleContinue}
                  editable={!isLoading}
                  className="h-full flex-1 text-base text-[#244C4E]"
                />

                <Pressable
                  onPress={() => {
                    setShowPassword(
                      (current) => !current,
                    );
                  }}
                  disabled={isLoading}
                  className="ml-3 h-10 w-10 items-center justify-center active:opacity-60"
                >
                  <Ionicons
                    name={
                      showPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={22}
                    color="#244C4E"
                  />
                </Pressable>
              </View>

              <Pressable
                onPress={handleContinue}
                disabled={isLoading}
                className={`mt-4 h-[58px] w-full flex-row items-center justify-center rounded-[24px] bg-[#C3F32C] active:opacity-80 ${
                  isLoading ? "opacity-60" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color="#244C4E"
                    />

                    <Text className="ml-3 text-base font-extrabold text-[#244C4E]">
                      Entrando...
                    </Text>
                  </>
                ) : (
                  <Text className="text-base font-extrabold text-[#244C4E]">
                    Entrar
                  </Text>
                )}
              </Pressable>

              <View className="mt-7 flex-row items-center justify-center gap-1.5">
                <Text className="text-sm text-[#244C4E]">
                  Não tem uma conta?
                </Text>

                <Pressable
                  onPress={handleRegister}
                  disabled={isLoading}
                  className="active:opacity-60"
                >
                  <Text className="text-sm font-bold text-[#8EB800]">
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