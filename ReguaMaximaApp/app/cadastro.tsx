import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";

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

import { registerWithEmail } from "../services/auth";

type Role = "CLIENT" | "BARBER";

export default function CadastroScreen() {
  const insets = useSafeAreaInsets();

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState<Role | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  function validateFirstStep() {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password || !confirmPassword) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos.");

      return false;
    }

    if (normalizedName.length < 2 || normalizedName.length > 80) {
      Alert.alert("Nome inválido", "O nome deve ter entre 2 e 80 caracteres.");

      return false;
    }

    if (!normalizedEmail.includes("@") || !normalizedEmail.includes(".")) {
      Alert.alert("E-mail inválido", "Digite um endereço de e-mail válido.");

      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Senhas diferentes",
        "A confirmação da senha não corresponde.",
      );

      return false;
    }

    return true;
  }

  function handleNextStep() {
    if (!validateFirstStep()) {
      return;
    }

    setStep(2);
  }

  async function handleRegister() {
    if (!role) {
      Alert.alert(
        "Escolha seu perfil",
        "Selecione se você é cliente ou barbeiro.",
      );
      return;
    }

    try {
      setIsLoading(true);

      await registerWithEmail(
        name.trim(),
        email.trim().toLowerCase(),
        password,
        role,
      );

      if (role === "BARBER") {
        router.replace("/barber-onboarding");
        return;
      }

      router.replace("/home");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar sua conta.";

      Alert.alert("Erro no cadastro", message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleBack() {
    if (isLoading) {
      return;
    }

    if (step === 2) {
      setStep(1);
      return;
    }

    router.back();
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
              onPress={handleBack}
              disabled={isLoading}
              className="h-12 w-12 items-center justify-center rounded-2xl bg-white active:opacity-70"
            >
              <Ionicons name="arrow-back" size={23} color="#244C4E" />
            </Pressable>

            {step === 1 ? (
              <View className="flex-1 justify-center py-10">
                <View className="w-full max-w-[420px] self-center">
                  <View className="mb-6 h-16 w-16 items-center justify-center rounded-[22px] bg-[#C3F32C]">
                    <Ionicons
                      name="person-add-outline"
                      size={29}
                      color="#244C4E"
                    />
                  </View>

                  <Text className="text-[32px] font-bold tracking-[-0.8px] text-[#244C4E]">
                    Crie sua conta
                  </Text>

                  <Text className="mt-3 text-base leading-6 text-gray-500">
                    Preencha seus dados para começar a usar o Régua Máxima.
                  </Text>

                  <View className="mt-8">
                    <Text className="mb-2 text-sm font-medium text-[#244C4E]">
                      Nome
                    </Text>

                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="Digite seu nome"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="words"
                      autoCorrect={false}
                      returnKeyType="next"
                      selectionColor="#244C4E"
                      editable={!isLoading}
                      onSubmitEditing={() => {
                        emailInputRef.current?.focus();
                      }}
                      className="h-[58px] w-full rounded-2xl border border-gray-200 bg-white px-[18px] text-base text-[#244C4E]"
                    />

                    <Text className="mb-2 mt-4 text-sm font-medium text-[#244C4E]">
                      E-mail
                    </Text>

                    <TextInput
                      ref={emailInputRef}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Digite seu e-mail"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      returnKeyType="next"
                      selectionColor="#244C4E"
                      editable={!isLoading}
                      onSubmitEditing={() => {
                        passwordInputRef.current?.focus();
                      }}
                      className="h-[58px] w-full rounded-2xl border border-gray-200 bg-white px-[18px] text-base text-[#244C4E]"
                    />

                    <Text className="mb-2 mt-4 text-sm font-medium text-[#244C4E]">
                      Senha
                    </Text>

                    <View className="h-[58px] w-full flex-row items-center rounded-2xl border border-gray-200 bg-white px-[18px]">
                      <TextInput
                        ref={passwordInputRef}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Crie uma senha"
                        placeholderTextColor="#9CA3AF"
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={!showPassword}
                        returnKeyType="next"
                        selectionColor="#244C4E"
                        editable={!isLoading}
                        onSubmitEditing={() => {
                          confirmPasswordInputRef.current?.focus();
                        }}
                        className="h-full flex-1 text-base text-[#244C4E]"
                      />

                      <Pressable
                        onPress={() => {
                          setShowPassword((current) => !current);
                        }}
                        className="ml-3 h-10 w-10 items-center justify-center"
                      >
                        <Ionicons
                          name={
                            showPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={22}
                          color="#244C4E"
                        />
                      </Pressable>
                    </View>

                    <Text className="mb-2 mt-4 text-sm font-medium text-[#244C4E]">
                      Confirmar senha
                    </Text>

                    <View className="h-[58px] w-full flex-row items-center rounded-2xl border border-gray-200 bg-white px-[18px]">
                      <TextInput
                        ref={confirmPasswordInputRef}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Repita sua senha"
                        placeholderTextColor="#9CA3AF"
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={!showConfirmPassword}
                        returnKeyType="done"
                        selectionColor="#244C4E"
                        editable={!isLoading}
                        onSubmitEditing={handleNextStep}
                        className="h-full flex-1 text-base text-[#244C4E]"
                      />

                      <Pressable
                        onPress={() => {
                          setShowConfirmPassword((current) => !current);
                        }}
                        className="ml-3 h-10 w-10 items-center justify-center"
                      >
                        <Ionicons
                          name={
                            showConfirmPassword
                              ? "eye-off-outline"
                              : "eye-outline"
                          }
                          size={22}
                          color="#244C4E"
                        />
                      </Pressable>
                    </View>

                    <Pressable
                      onPress={handleNextStep}
                      className="mt-6 h-[58px] w-full items-center justify-center rounded-[24px] bg-[#C3F32C] active:opacity-80"
                    >
                      <Text className="text-base font-extrabold text-[#244C4E]">
                        Continuar
                      </Text>
                    </Pressable>

                    <View className="mt-7 flex-row items-center justify-center gap-1.5">
                      <Text className="text-sm text-[#244C4E]">
                        Já tem uma conta?
                      </Text>

                      <Pressable onPress={() => router.replace("/")}>
                        <Text className="text-sm font-bold text-[#8EB800]">
                          Entrar
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View className="flex-1 justify-center py-10">
                <View className="w-full max-w-[420px] self-center">
                  <View className="items-center">
                    <View className="h-16 w-16 items-center justify-center rounded-full bg-[#C3F32C]">
                      <Ionicons
                        name="options-outline"
                        size={29}
                        color="#244C4E"
                      />
                    </View>

                    <Text className="mt-5 text-center text-[30px] font-bold tracking-[-0.7px] text-[#244C4E]">
                      Crie seu perfil
                    </Text>

                    <Text className="mt-2 text-center text-base leading-6 text-gray-500">
                      Vamos conhecer você para personalizar sua experiência.
                    </Text>
                  </View>

                  <View className="mt-10 gap-4">
                    <Pressable
                      onPress={() => setRole("CLIENT")}
                      disabled={isLoading}
                      className={`rounded-[26px] border-2 bg-white p-6 ${
                        role === "CLIENT"
                          ? "border-[#C3F32C]"
                          : "border-gray-200"
                      }`}
                    >
                      <View className="flex-row items-center">
                        <View className="h-16 w-16 items-center justify-center rounded-[22px] bg-[#C3F32C]">
                          <Ionicons
                            name="person-outline"
                            size={30}
                            color="#244C4E"
                          />
                        </View>

                        <View className="ml-5 flex-1">
                          <Text className="text-xl font-bold text-[#244C4E]">
                            Você é o cliente,
                          </Text>

                          <Text className="text-xl font-bold text-[#8EB800]">
                            {name.trim()}?
                          </Text>

                          <Text className="mt-2 text-sm leading-5 text-gray-500">
                            Encontre barbearias, escolha profissionais e faça
                            seus agendamentos.
                          </Text>
                        </View>

                        {role === "CLIENT" && (
                          <Ionicons
                            name="checkmark-circle"
                            size={26}
                            color="#8EB800"
                          />
                        )}
                      </View>
                    </Pressable>

                    <Pressable
                      onPress={() => setRole("BARBER")}
                      disabled={isLoading}
                      className={`rounded-[26px] border-2 bg-white p-6 ${
                        role === "BARBER"
                          ? "border-[#C3F32C]"
                          : "border-gray-200"
                      }`}
                    >
                      <View className="flex-row items-center">
                        <View className="h-16 w-16 items-center justify-center rounded-[22px] bg-[#C3F32C]">
                          <Ionicons
                            name="cut-outline"
                            size={30}
                            color="#244C4E"
                          />
                        </View>

                        <View className="ml-5 flex-1">
                          <Text className="text-xl font-bold text-[#244C4E]">
                            Você é o barbeiro,
                          </Text>

                          <Text className="text-xl font-bold text-[#8EB800]">
                            {name.trim()}?
                          </Text>

                          <Text className="mt-2 text-sm leading-5 text-gray-500">
                            Organize seus atendimentos, agenda e sua presença no
                            Régua Máxima.
                          </Text>
                        </View>

                        {role === "BARBER" && (
                          <Ionicons
                            name="checkmark-circle"
                            size={26}
                            color="#8EB800"
                          />
                        )}
                      </View>
                    </Pressable>
                  </View>

                  <Pressable
                    onPress={handleRegister}
                    disabled={!role || isLoading}
                    className={`mt-8 h-[58px] w-full flex-row items-center justify-center rounded-[24px] bg-[#C3F32C] ${
                      !role || isLoading ? "opacity-50" : "active:opacity-80"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <ActivityIndicator size="small" color="#244C4E" />

                        <Text className="ml-3 text-base font-extrabold text-[#244C4E]">
                          Criando conta...
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text className="text-base font-extrabold text-[#244C4E]">
                          Prosseguir
                        </Text>

                        <Ionicons
                          name="chevron-forward"
                          size={19}
                          color="#244C4E"
                          style={{
                            marginLeft: 6,
                          }}
                        />
                      </>
                    )}
                  </Pressable>

                  <Pressable
                    onPress={() => setStep(1)}
                    disabled={isLoading}
                    className="mt-4 h-12 items-center justify-center"
                  >
                    <Text className="font-semibold text-[#244C4E]">Voltar</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
