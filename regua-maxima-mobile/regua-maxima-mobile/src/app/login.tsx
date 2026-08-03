import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/providers/auth-provider';
import { getPublicAssetUrl } from '@/services/barbershops';

const GREEN = '#BCF51A';
const INK = '#153F40';

type AuthMode = 'login' | 'register';

const providers = [
  { label: 'Google', icon: 'logo-google' },
  { label: 'Facebook', icon: 'logo-facebook' },
  { label: 'Apple', icon: 'logo-apple' },
  { label: 'GitHub', icon: 'logo-github' },
] as const;

const lightPalette = {
  background: '#F7F8F6',
  card: '#FFFFFF',
  text: INK,
  secondary: '#74807D',
  border: '#DDE2DD',
  input: '#FFFFFF',
};

const darkPalette = {
  background: '#102526',
  card: '#173334',
  text: '#F6FAF4',
  secondary: '#B1BFBB',
  border: '#315050',
  input: '#193839',
};

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function messageFrom(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Não foi possível concluir. Tente novamente.';
}

export default function LoginScreen() {
  const { signIn, signUp, sendPasswordReset } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFailed, setLogoFailed] = useState(false);
  const submitLockRef = useRef(false);
  const palette = darkMode ? darkPalette : lightPalette;
  const logoUrl = useMemo(() => getPublicAssetUrl('/LogoMComBorder3.png'), []);
  const isRegister = mode === 'register';

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError(null);
  };

  const socialLogin = (provider: string) => {
    Alert.alert(
      `Continuar com ${provider}`,
      'O login social ainda não está disponível nesta versão e no Expo Go. Use seu e-mail e senha por enquanto.',
    );
  };

  const submit = async () => {
    if (submitLockRef.current) return;

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    setError(null);

    if (isRegister && trimmedName.length < 2) {
      setError('Informe seu nome completo.');
      return;
    }

    if (!validEmail(normalizedEmail)) {
      setError('Informe um e-mail válido.');
      return;
    }

    if (!password) {
      setError('Informe sua senha.');
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      submitLockRef.current = true;
      setSubmitting(true);

      if (isRegister) {
        await signUp({
          name: trimmedName,
          email: normalizedEmail,
          password,
          confirmPassword,
        });
      } else {
        await signIn({ email: normalizedEmail, password });
      }

      router.replace('/(tabs)/index');
    } catch (submitError) {
      setError(messageFrom(submitError));
    } finally {
      submitLockRef.current = false;
      setSubmitting(false);
    }
  };

  const forgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    setError(null);

    if (!validEmail(normalizedEmail)) {
      setError('Digite seu e-mail acima para recuperar a senha.');
      return;
    }

    try {
      setResettingPassword(true);
      const message = await sendPasswordReset(normalizedEmail);
      Alert.alert('Confira seu e-mail', message);
    } catch (resetError) {
      setError(messageFrom(resetError));
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.themeRow}>
            <View
              style={[
                styles.themeControl,
                { backgroundColor: palette.card, borderColor: palette.border },
              ]}>
              <Text style={[styles.themeText, { color: palette.text }]}>Tema</Text>
              <Switch
                accessibilityLabel="Alternar tema"
                onValueChange={setDarkMode}
                thumbColor={darkMode ? INK : '#FFFFFF'}
                trackColor={{ false: '#CAD2CE', true: GREEN }}
                value={darkMode}
              />
            </View>
          </View>

          <View style={styles.hero}>
            <View
              style={[
                styles.logoCard,
                { backgroundColor: palette.card, borderColor: palette.border },
              ]}>
              {logoUrl && !logoFailed ? (
                <Image
                  contentFit="contain"
                  onError={() => setLogoFailed(true)}
                  source={logoUrl}
                  style={styles.logo}
                />
              ) : (
                <Ionicons name="options-outline" size={34} color={palette.text} />
              )}
            </View>
            <Text style={[styles.title, { color: palette.text }]}>
              {isRegister ? 'Crie sua conta' : 'Entre na sua conta'}
            </Text>
            <Text style={[styles.subtitle, { color: palette.secondary }]}>
              {isRegister
                ? 'Cadastre-se para agendar seus próximos cortes.'
                : 'Acesse seus agendamentos e barbearias favoritas.'}
            </Text>
          </View>

          {!isRegister ? (
            <View style={styles.providers}>
              {providers.map((provider) => (
                <TouchableOpacity
                  key={provider.label}
                  activeOpacity={0.82}
                  style={styles.providerButton}
                  onPress={() => socialLogin(provider.label)}>
                  <Ionicons name={provider.icon} size={19} color="#071515" />
                  <Text style={styles.providerText}>Continuar com {provider.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          {!isRegister ? (
            <View style={styles.dividerRow}>
              <View style={[styles.divider, { backgroundColor: palette.border }]} />
              <Text style={[styles.dividerText, { color: palette.secondary }]}>OU</Text>
              <View style={[styles.divider, { backgroundColor: palette.border }]} />
            </View>
          ) : null}

          <View style={styles.form}>
            {isRegister ? (
              <View style={styles.field}>
                <Text style={[styles.label, { color: palette.text }]}>Nome completo</Text>
                <TextInput
                  autoCapitalize="words"
                  autoComplete="name"
                  editable={!submitting}
                  onChangeText={setName}
                  placeholder="Como podemos chamar você?"
                  placeholderTextColor={palette.secondary}
                  style={[
                    styles.input,
                    {
                      backgroundColor: palette.input,
                      borderColor: palette.border,
                      color: palette.text,
                    },
                  ]}
                  value={name}
                />
              </View>
            ) : null}

            <View style={styles.field}>
              <Text style={[styles.label, { color: palette.text }]}>E-mail</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                editable={!submitting}
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="voce@exemplo.com"
                placeholderTextColor={palette.secondary}
                style={[
                  styles.input,
                  {
                    backgroundColor: palette.input,
                    borderColor: palette.border,
                    color: palette.text,
                  },
                ]}
                value={email}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: palette.text }]}>Senha</Text>
              <View
                style={[
                  styles.passwordInput,
                  { backgroundColor: palette.input, borderColor: palette.border },
                ]}>
                <TextInput
                  autoCapitalize="none"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  editable={!submitting}
                  onChangeText={setPassword}
                  onSubmitEditing={() => {
                    if (!isRegister) void submit();
                  }}
                  placeholder={isRegister ? 'Crie uma senha segura' : 'Digite sua senha'}
                  placeholderTextColor={palette.secondary}
                  secureTextEntry={!showPassword}
                  style={[styles.passwordField, { color: palette.text }]}
                  value={password}
                />
                <TouchableOpacity
                  accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((current) => !current)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={palette.secondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {isRegister ? (
              <View style={styles.field}>
                <Text style={[styles.label, { color: palette.text }]}>Confirme a senha</Text>
                <View
                  style={[
                    styles.passwordInput,
                    { backgroundColor: palette.input, borderColor: palette.border },
                  ]}>
                  <TextInput
                    autoCapitalize="none"
                    autoComplete="new-password"
                    editable={!submitting}
                    onChangeText={setConfirmPassword}
                    onSubmitEditing={() => void submit()}
                    placeholder="Repita sua senha"
                    placeholderTextColor={palette.secondary}
                    secureTextEntry={!showConfirmPassword}
                    style={[styles.passwordField, { color: palette.text }]}
                    value={confirmPassword}
                  />
                  <TouchableOpacity
                    accessibilityLabel={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword((current) => !current)}>
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={palette.secondary}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.passwordHint, { color: palette.secondary }]}>
                  Use 8 ou mais caracteres e combine letras, números e símbolos.
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                disabled={submitting || resettingPassword}
                style={styles.forgotButton}
                onPress={() => void forgotPassword()}>
                {resettingPassword ? (
                  <ActivityIndicator size="small" color={palette.text} />
                ) : (
                  <Text style={[styles.forgotText, { color: palette.text }]}>Esqueci minha senha</Text>
                )}
              </TouchableOpacity>
            )}

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={18} color="#B73535" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.82}
              disabled={submitting}
              style={[styles.submitButton, submitting && styles.buttonDisabled]}
              onPress={() => void submit()}>
              {submitting ? (
                <ActivityIndicator color={INK} />
              ) : (
                <Text style={styles.submitText}>{isRegister ? 'Criar conta' : 'Entrar'}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.switchModeRow}>
            <Text style={[styles.switchModeText, { color: palette.secondary }]}>
              {isRegister ? 'Já tem uma conta?' : 'Não tem uma conta?'}
            </Text>
            <TouchableOpacity onPress={() => switchMode(isRegister ? 'login' : 'register')}>
              <Text style={[styles.switchModeLink, { color: palette.text }]}>
                {isRegister ? 'Entrar' : 'Cadastre-se'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 26,
    paddingBottom: 38,
  },
  themeRow: { height: 68, alignItems: 'flex-end', justifyContent: 'center' },
  themeControl: {
    height: 42,
    paddingLeft: 14,
    paddingRight: 6,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  themeText: { fontSize: 12, fontWeight: '800' },
  hero: { alignItems: 'center', paddingTop: 26, paddingBottom: 28 },
  logoCard: {
    width: 82,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  logo: { width: 68, height: 42 },
  title: { marginTop: 18, fontSize: 29, lineHeight: 35, fontWeight: '900', letterSpacing: -0.7 },
  subtitle: { maxWidth: 340, marginTop: 8, fontSize: 13, lineHeight: 19, fontWeight: '600', textAlign: 'center' },
  providers: { gap: 10 },
  providerButton: {
    height: 46,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: GREEN,
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerText: { flex: 1, marginRight: 19, color: '#071515', fontSize: 13, fontWeight: '900', textAlign: 'center' },
  dividerRow: { marginVertical: 27, flexDirection: 'row', alignItems: 'center', gap: 14 },
  divider: { flex: 1, height: 1 },
  dividerText: { fontSize: 11, fontWeight: '900' },
  form: { gap: 17 },
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: '900' },
  input: { height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 15, fontSize: 14, fontWeight: '600' },
  passwordInput: { height: 50, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  passwordField: { flex: 1, height: '100%', paddingLeft: 15, fontSize: 14, fontWeight: '600' },
  eyeButton: { width: 49, height: 49, alignItems: 'center', justifyContent: 'center' },
  passwordHint: { fontSize: 10, lineHeight: 15, fontWeight: '600' },
  forgotButton: { minHeight: 24, alignSelf: 'flex-end', justifyContent: 'center' },
  forgotText: { fontSize: 11, fontWeight: '900', textDecorationLine: 'underline' },
  errorBox: { minHeight: 46, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FBEDEC', borderWidth: 1, borderColor: '#F0C7C4', flexDirection: 'row', alignItems: 'center', gap: 9 },
  errorText: { flex: 1, color: '#9C3030', fontSize: 11, lineHeight: 16, fontWeight: '700' },
  submitButton: { height: 50, borderRadius: 15, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center' },
  buttonDisabled: { opacity: 0.65 },
  submitText: { color: '#071515', fontSize: 13, fontWeight: '900' },
  switchModeRow: { marginTop: 29, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 },
  switchModeText: { fontSize: 12, fontWeight: '600' },
  switchModeLink: { fontSize: 12, fontWeight: '900', textDecorationLine: 'underline' },
});
