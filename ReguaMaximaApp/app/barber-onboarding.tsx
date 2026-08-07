import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

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

import { updateBarberProfile } from "../services/barber";

const SPECIALTIES = [
  "Corte clássico",
  "Degradê",
  "Barba",
  "Sobrancelha",
  "Pigmentação",
  "Selagem",
  "Relaxamento",
  "Luzes",
  "Navalhado",
  "Visagismo",
];

export default function BarberOnboardingScreen() {
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(1);

  const [nome, setNome] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [cidade, setCidade] = useState("");
  const [telefone, setTelefone] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 6;

  const progress = `${Math.round((step / totalSteps) * 100)}%`;

  async function handlePickImage() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso às suas fotos para escolher uma imagem de perfil.",
      );

      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    setAvatar(result.assets[0].uri);
  }

  function toggleSpecialty(item: string) {
    setEspecialidades((current) => {
      if (current.includes(item)) {
        return current.filter(
          (specialty) => specialty !== item,
        );
      }

      return [...current, item];
    });
  }

  function validateCurrentStep() {
    if (step === 1) {
      if (nome.trim().length < 2) {
        Alert.alert(
          "Nome inválido",
          "Digite um nome com pelo menos 2 caracteres.",
        );

        return false;
      }
    }

    if (step === 2) {
      if (!avatar) {
        Alert.alert(
          "Foto obrigatória",
          "Escolha uma foto para o seu perfil.",
        );

        return false;
      }
    }

    if (step === 3) {
      if (bio.trim().length < 10) {
        Alert.alert(
          "Bio muito curta",
          "Digite pelo menos 10 caracteres sobre você.",
        );

        return false;
      }
    }

    if (step === 4) {
      if (especialidades.length < 1) {
        Alert.alert(
          "Especialidades",
          "Selecione pelo menos uma especialidade.",
        );

        return false;
      }
    }

    if (step === 5) {
      if (cidade.trim().length < 2) {
        Alert.alert(
          "Cidade inválida",
          "Digite sua cidade ou região.",
        );

        return false;
      }
    }

    if (step === 6) {
      if (telefone.trim().length < 8) {
        Alert.alert(
          "Telefone inválido",
          "Digite um telefone válido.",
        );

        return false;
      }
    }

    return true;
  }

  function handleNext() {
    if (!validateCurrentStep()) {
      return;
    }

    if (step < totalSteps) {
      setStep((current) => current + 1);
      return;
    }

    handleFinish();
  }

  function handleBack() {
    if (isLoading) {
      return;
    }

    if (step > 1) {
      setStep((current) => current - 1);
      return;
    }

    router.back();
  }

  async function handleFinish() {
    if (!validateCurrentStep()) {
      return;
    }

    try {
      setIsLoading(true);

      await updateBarberProfile({
        nome: nome.trim(),
        avatar,
        bio: bio.trim(),
        especialidades,
        cidade: cidade.trim(),
        telefone: telefone.trim(),
      });

      router.replace("/home");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível concluir seu perfil.";

      Alert.alert(
        "Erro ao salvar perfil",
        message,
      );
    } finally {
      setIsLoading(false);
    }
  }

  function renderStepContent() {
    if (step === 1) {
      return (
        <>
          <View className="mb-6 h-16 w-16 items-center justify-center rounded-[22px] bg-[#C3F32C]">
            <Ionicons
              name="person-outline"
              size={30}
              color="#244C4E"
            />
          </View>

          <Text className="text-[30px] font-bold tracking-[-0.8px] text-[#244C4E]">
            Como quer ser chamado?
          </Text>

          <Text className="mt-3 text-base leading-6 text-gray-500">
            Esse será o nome exibido para seus clientes.
          </Text>

          <View className="mt-8">
            <Text className="mb-2 text-sm font-medium text-[#244C4E]">
              Nome público
            </Text>

            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Kaio Cotrim"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleNext}
              className="h-[58px] w-full rounded-2xl border border-gray-200 bg-white px-[18px] text-base text-[#244C4E]"
            />
          </View>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <View className="mb-6 h-16 w-16 items-center justify-center rounded-[22px] bg-[#C3F32C]">
            <Ionicons
              name="camera-outline"
              size={30}
              color="#244C4E"
            />
          </View>

          <Text className="text-[30px] font-bold tracking-[-0.8px] text-[#244C4E]">
            Adicione uma foto
          </Text>

          <Text className="mt-3 text-base leading-6 text-gray-500">
            Uma boa foto ajuda seus clientes a reconhecerem você.
          </Text>

          <View className="mt-10 items-center">
            <Pressable
              onPress={handlePickImage}
              className="h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-[#C3F32C] bg-white active:opacity-80"
            >
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  resizeMode="cover"
                  className="h-full w-full"
                />
              ) : (
                <Ionicons
                  name="person-outline"
                  size={54}
                  color="#244C4E"
                />
              )}
            </Pressable>

            <Pressable
              onPress={handlePickImage}
              className="mt-5 rounded-[22px] bg-white px-6 py-3 active:opacity-70"
            >
              <Text className="font-bold text-[#244C4E]">
                Escolher foto
              </Text>
            </Pressable>
          </View>
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <View className="mb-6 h-16 w-16 items-center justify-center rounded-[22px] bg-[#C3F32C]">
            <Ionicons
              name="document-text-outline"
              size={30}
              color="#244C4E"
            />
          </View>

          <Text className="text-[30px] font-bold tracking-[-0.8px] text-[#244C4E]">
            Conte um pouco sobre você
          </Text>

          <Text className="mt-3 text-base leading-6 text-gray-500">
            Escreva uma breve apresentação para seus clientes.
          </Text>

          <View className="mt-8">
            <Text className="mb-2 text-sm font-medium text-[#244C4E]">
              Bio
            </Text>

            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Ex: Especialista em degradê, barba e cortes modernos..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              maxLength={400}
              className="min-h-[150px] w-full rounded-[22px] border border-gray-200 bg-white px-[18px] py-4 text-base text-[#244C4E]"
            />

            <Text className="mt-2 text-right text-xs text-gray-400">
              {bio.length}/400
            </Text>
          </View>
        </>
      );
    }

    if (step === 4) {
      return (
        <>
          <View className="mb-6 h-16 w-16 items-center justify-center rounded-[22px] bg-[#C3F32C]">
            <Ionicons
              name="cut-outline"
              size={30}
              color="#244C4E"
            />
          </View>

          <Text className="text-[30px] font-bold tracking-[-0.8px] text-[#244C4E]">
            Quais são suas especialidades?
          </Text>

          <Text className="mt-3 text-base leading-6 text-gray-500">
            Selecione pelo menos uma opção.
          </Text>

          <View className="mt-8 flex-row flex-wrap gap-3">
            {SPECIALTIES.map((item) => {
              const selected =
                especialidades.includes(item);

              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    toggleSpecialty(item)
                  }
                  className={`rounded-full border px-5 py-3 ${
                    selected
                      ? "border-[#C3F32C] bg-[#C3F32C]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      selected
                        ? "text-[#244C4E]"
                        : "text-gray-600"
                    }`}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      );
    }

    if (step === 5) {
      return (
        <>
          <View className="mb-6 h-16 w-16 items-center justify-center rounded-[22px] bg-[#C3F32C]">
            <Ionicons
              name="location-outline"
              size={30}
              color="#244C4E"
            />
          </View>

          <Text className="text-[30px] font-bold tracking-[-0.8px] text-[#244C4E]">
            Onde você atende?
          </Text>

          <Text className="mt-3 text-base leading-6 text-gray-500">
            Informe sua cidade ou região de atendimento.
          </Text>

          <View className="mt-8">
            <Text className="mb-2 text-sm font-medium text-[#244C4E]">
              Cidade / região
            </Text>

            <TextInput
              value={cidade}
              onChangeText={setCidade}
              placeholder="Ex: São Paulo, SP"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleNext}
              className="h-[58px] w-full rounded-2xl border border-gray-200 bg-white px-[18px] text-base text-[#244C4E]"
            />
          </View>
        </>
      );
    }

    return (
      <>
        <View className="mb-6 h-16 w-16 items-center justify-center rounded-[22px] bg-[#C3F32C]">
          <Ionicons
            name="call-outline"
            size={30}
            color="#244C4E"
          />
        </View>

        <Text className="text-[30px] font-bold tracking-[-0.8px] text-[#244C4E]">
          Qual é o seu telefone?
        </Text>

        <Text className="mt-3 text-base leading-6 text-gray-500">
          Seus dados de contato ajudam na comunicação com clientes.
        </Text>

        <View className="mt-8">
          <Text className="mb-2 text-sm font-medium text-[#244C4E]">
            Telefone
          </Text>

          <TextInput
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(11) 99999-9999"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            returnKeyType="done"
            onSubmitEditing={handleFinish}
            className="h-[58px] w-full rounded-2xl border border-gray-200 bg-white px-[18px] text-base text-[#244C4E]"
          />
        </View>
      </>
    );
  }

  return (
    <View className="flex-1 bg-[#F4F4F4]">
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
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
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={handleBack}
                disabled={isLoading}
                className="h-12 w-12 items-center justify-center rounded-2xl bg-white active:opacity-70"
              >
                <Ionicons
                  name="arrow-back"
                  size={23}
                  color="#244C4E"
                />
              </Pressable>

              <Text className="text-sm font-semibold text-gray-500">
                {step} / {totalSteps}
              </Text>
            </View>

            <View className="mt-5 h-2 overflow-hidden rounded-full bg-gray-200">
              <View
                className="h-full rounded-full bg-[#C3F32C]"
                style={{
                  width: progress,
                }}
              />
            </View>

            <View className="flex-1 justify-center py-10">
              <View className="w-full max-w-[420px] self-center">
                {renderStepContent()}

                <Pressable
                  onPress={handleNext}
                  disabled={isLoading}
                  className={`mt-10 h-[58px] w-full flex-row items-center justify-center rounded-[24px] bg-[#C3F32C] ${
                    isLoading
                      ? "opacity-60"
                      : "active:opacity-80"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <ActivityIndicator
                        size="small"
                        color="#244C4E"
                      />

                      <Text className="ml-3 text-base font-extrabold text-[#244C4E]">
                        Salvando...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text className="text-base font-extrabold text-[#244C4E]">
                        {step === totalSteps
                          ? "Concluir"
                          : "Continuar"}
                      </Text>

                      <Ionicons
                        name={
                          step === totalSteps
                            ? "checkmark"
                            : "chevron-forward"
                        }
                        size={20}
                        color="#244C4E"
                        style={{
                          marginLeft: 6,
                        }}
                      />
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}