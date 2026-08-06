import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { requestPasswordReset } from "../services/auth";

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert(
        "Campo obrigatório",
        "Digite o seu endereço de e-mail.",
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

      const message =
        await requestPasswordReset(normalizedEmail);

      setEmailSent(true);

      Alert.alert(
        "E-mail enviado",
        message,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível solicitar a recuperação.";

      Alert.alert(
        "Erro ao recuperar senha",
        message,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-[#F4F4F4]">
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6">
            <Pressable
              onPress={() => router.back()}
              className="h-12 w-12 items-center justify-center rounded-2xl bg-white active:opacity-70"
            >
              <Ionicons
                name="arrow-back"
                size={23}
                color="#244C4E"
              />
            </Pressable>

            <View className="flex-1 justify-center pb-20">
              <View className="w-full max-w-[420px] self-center">
                <View className="mb-6 h-16 w-16 items-center justify-center rounded-[22px] bg-[#C3F32C]">
                  <Ionicons
                    name="lock-closed-outline"
                    size={29}
                    color="#244C4E"
                  />
                </View>

                <Text className="text-[32px] font-bold tracking-[-0.8px] text-[#244C4E]">
                  Esqueceu sua senha?
                </Text>

                <Text className="mt-3 text-base leading-6 text-gray-500">
                  Digite o e-mail cadastrado na sua conta. Enviaremos
                  as instruções para você criar uma nova senha.
                </Text>

                {emailSent ? (
                  <View className="mt-8 rounded-[24px] border border-[#C3F32C]/50 bg-[#C3F32C]/10 p-5">
                    <View className="flex-row items-start gap-3">
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#6D8D08"
                      />

                      <View className="flex-1">
                        <Text className="font-bold text-[#244C4E]">
                          Verifique seu e-mail
                        </Text>

                        <Text className="mt-1 leading-5 text-gray-600">
                          Enviamos as instruções para:
                        </Text>

                        <Text className="mt-1 font-semibold text-[#244C4E]">
                          {email.trim().toLowerCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View className="mt-8">
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
                      returnKeyType="send"
                      selectionColor="#244C4E"
                      onSubmitEditing={handleSubmit}
                      editable={!isLoading}
                      className="h-[58px] w-full rounded-2xl border border-gray-200 bg-white px-[18px] text-base text-[#244C4E]"
                    />

                    <Pressable
                      onPress={handleSubmit}
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
                            Enviando...
                          </Text>
                        </>
                      ) : (
                        <Text className="text-base font-extrabold text-[#244C4E]">
                          Enviar instruções
                        </Text>
                      )}
                    </Pressable>
                  </View>
                )}

                {emailSent && (
                  <View className="mt-6 gap-3">
                    <Pressable
                      onPress={() => {
                        setEmailSent(false);
                      }}
                      className="h-[56px] w-full items-center justify-center rounded-[24px] bg-[#C3F32C] active:opacity-80"
                    >
                      <Text className="font-bold text-[#244C4E]">
                        Enviar novamente
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => router.replace("/")}
                      className="h-[56px] w-full items-center justify-center rounded-[24px] border border-gray-300 bg-white active:opacity-70"
                    >
                      <Text className="font-bold text-[#244C4E]">
                        Voltar para o login
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}