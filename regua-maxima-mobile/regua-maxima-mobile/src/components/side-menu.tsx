import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/providers/auth-provider';

const GREEN = '#BCF51A';
const INK = '#153F40';

type SideMenuProps = {
  visible: boolean;
  onClose: () => void;
};

type MenuItem = {
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  requiresAuth?: boolean;
  onlyBarber?: boolean;
  onlyClient?: boolean;
  action?: 'home';
};

const menuItems: MenuItem[] = [
  {
    label: 'Início',
    description: 'Volte para tela de início',
    icon: 'home-outline',
    action: 'home',
  },
  {
    label: 'Minha Barbearia',
    description: 'Gerencie sua barbearia',
    icon: 'cut-outline',
    requiresAuth: true,
    onlyBarber: true,
  },
  {
    label: 'Agendamentos',
    description: 'Agendamentos e histórico',
    icon: 'calendar-outline',
    requiresAuth: true,
    onlyClient: true,
  },
  {
    label: 'Favoritos',
    description: 'Seus favoritos',
    icon: 'heart-outline',
    requiresAuth: true,
  },
  {
    label: 'Notificações',
    description: 'Avisos sobre seus agendamentos',
    icon: 'notifications-outline',
    requiresAuth: true,
  },
  {
    label: 'Perfil',
    description: 'Faça seu trabalho falar por você',
    icon: 'person-outline',
    onlyBarber: true,
  },
  {
    label: 'Plano',
    description: 'Assinatura do plano',
    icon: 'card-outline',
    requiresAuth: true,
    onlyBarber: true,
  },
  {
    label: 'Inbox',
    description: 'Veja seus convites e notificações',
    icon: 'mail-outline',
    requiresAuth: true,
    onlyBarber: true,
  },
  {
    label: 'Configurações',
    description: 'Ajustes da conta',
    icon: 'settings-outline',
    requiresAuth: true,
  },
];

export function SideMenu({ visible, onClose }: SideMenuProps) {
  const { user, signOut } = useAuth();
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(370, width * 0.9);
  const translateX = useRef(new Animated.Value(panelWidth)).current;
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    if (!visible) return;
    translateX.setValue(panelWidth);
    Animated.spring(translateX, {
      toValue: 0,
      damping: 24,
      stiffness: 210,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [panelWidth, translateX, visible]);

  const close = () => {
    Animated.timing(translateX, {
      toValue: panelWidth,
      duration: 190,
      useNativeDriver: true,
    }).start(onClose);
  };

  const requestLogin = () => {
    close();
    setTimeout(() => router.replace('/login'), 220);
  };

  const handleItem = (item: MenuItem, locked: boolean) => {
    if (locked) return;
    if (item.action === 'home') {
      close();
      setTimeout(() => router.replace('/(tabs)/index'), 200);
      return;
    }

    Alert.alert(item.label, 'Esta área será conectada na próxima etapa do aplicativo.');
  };

  const confirmLogout = () => {
    Alert.alert('Sair da conta?', 'Você precisará entrar novamente para acessar o aplicativo.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          onClose();
          void signOut();
        },
      },
    ]);
  };

  const visibleItems = menuItems
    .filter((item) => !item.onlyBarber || user?.role === 'BARBER')
    .filter((item) => !item.onlyClient || user?.role === 'CLIENT');

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={close}>
      <View style={styles.modalRoot}>
        <BlurView
          tint="dark"
          intensity={22}
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />
        <Pressable style={styles.backdrop} onPress={close} />

        <Animated.View
          style={[
            styles.panel,
            { width: panelWidth, transform: [{ translateX }] },
          ]}>
          <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
            <View style={styles.topBar}>
              <Text style={styles.panelTitle}>Menu</Text>
              <TouchableOpacity accessibilityLabel="Fechar menu" style={styles.closeButton} onPress={close}>
                <Ionicons name="close" size={22} color={INK} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
              {user ? (
                <View style={styles.userCard}>
                  <View style={styles.avatarWrap}>
                    {user.image ? (
                      <Image source={user.image} contentFit="cover" style={styles.avatar} />
                    ) : (
                      <View style={styles.avatarFallback}>
                        <Text style={styles.avatarInitials}>
                          {user.name
                            .split(' ')
                            .slice(0, 2)
                            .map((part) => part.charAt(0).toUpperCase())
                            .join('') || 'U'}
                        </Text>
                      </View>
                    )}
                    <View style={styles.roleBadge}>
                      <Ionicons
                        name={user.role === 'BARBER' ? 'cut-outline' : 'person-outline'}
                        size={9}
                        color={INK}
                      />
                      <Text style={styles.roleText}>{user.role === 'BARBER' ? 'BAR' : 'VIP'}</Text>
                    </View>
                  </View>
                  <View style={styles.userInfo}>
                    <Text numberOfLines={1} style={styles.userName}>{user.name}</Text>
                    <Text numberOfLines={1} style={styles.userEmail}>{user.email}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.loginCard}>
                  <View style={styles.loginIntro}>
                    <Ionicons name="person-circle-outline" size={22} color="#798280" />
                    <Text style={styles.loginPrompt}>Faça o seu login</Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.8} style={styles.loginButton} onPress={requestLogin}>
                    <Ionicons name="log-in-outline" size={16} color={INK} />
                    <Text style={styles.loginButtonText}>Entrar</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.brandCard}>
                <Text style={styles.brandHeadline}>
                  {isLoggedIn
                    ? user?.role === 'BARBER'
                      ? 'Mais um cliente para deixar na '
                      : 'Vai deixar o cabelo na '
                    : 'Venha entrar para o time da '}
                  <Text style={styles.brandHighlight}>
                    {isLoggedIn ? 'régua?' : 'RéguaMáxima.'}
                  </Text>
                </Text>
                <Text style={styles.brandSignature}>
                  Régua <Text style={styles.brandSignatureGreen}>Máxima.</Text>
                </Text>
              </View>

              <View style={styles.separator} />
              <View style={styles.menuLabelRow}>
                <Text style={styles.menuLabel}>MENU</Text>
                <View style={styles.menuLabelLine} />
              </View>

              {!isLoggedIn ? (
                <View style={styles.accessCard}>
                  <View style={styles.accessIcon}>
                    <Ionicons name="key-outline" size={19} color="#6FA200" />
                  </View>
                  <View style={styles.accessCopy}>
                    <Text style={styles.accessTitle}>Acesso Completo</Text>
                    <Text style={styles.accessText}>
                      Entre na sua conta para acessar agendamentos e recursos exclusivos.
                    </Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.items}>
                {visibleItems.map((item) => {
                  const locked = Boolean(item.requiresAuth && !isLoggedIn);
                  return (
                    <TouchableOpacity
                      key={item.label}
                      activeOpacity={locked ? 1 : 0.75}
                      disabled={locked}
                      style={[styles.item, locked && styles.itemLocked]}
                      onPress={() => handleItem(item, locked)}>
                      <View style={[styles.itemIcon, locked && styles.itemIconLocked]}>
                        <Ionicons
                          name={item.icon}
                          size={18}
                          color={locked ? '#ABB1AF' : '#78A900'}
                        />
                      </View>
                      <View style={styles.itemCopy}>
                        <Text style={[styles.itemLabel, locked && styles.itemLabelLocked]}>
                          {item.label}
                        </Text>
                        <Text numberOfLines={1} style={styles.itemDescription}>{item.description}</Text>
                      </View>
                      <Ionicons
                        name={locked ? 'lock-closed-outline' : 'chevron-forward'}
                        size={16}
                        color={locked ? '#AEB4B2' : '#87908E'}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              {user ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.logoutButton}
                  onPress={confirmLogout}>
                  <Ionicons name="log-out-outline" size={18} color="#D44C45" />
                  <Text style={styles.logoutText}>Sair da conta</Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1, alignItems: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,18,20,0.34)' },
  panel: { height: '100%', backgroundColor: '#F7F8F5', borderLeftWidth: 1, borderLeftColor: '#DCE1DC', shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 28, shadowOffset: { width: -10, height: 0 }, elevation: 18 },
  safeArea: { flex: 1 },
  topBar: { height: 58, paddingHorizontal: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle: { color: INK, fontSize: 17, fontWeight: '900' },
  closeButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#ECEFEC', alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 18, paddingBottom: 26 },
  userCard: { minHeight: 78, padding: 13, borderRadius: 17, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE4DF' },
  avatarWrap: { width: 53, height: 53 },
  avatar: { width: 53, height: 53, borderRadius: 16 },
  avatarFallback: { width: 53, height: 53, borderRadius: 16, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { color: INK, fontSize: 15, fontWeight: '900' },
  roleBadge: { position: 'absolute', right: -6, bottom: -5, minHeight: 18, paddingHorizontal: 5, borderRadius: 9, flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: GREEN, borderWidth: 2, borderColor: '#FFFFFF' },
  roleText: { color: INK, fontSize: 7, fontWeight: '900' },
  userInfo: { flex: 1, marginLeft: 13 },
  userName: { color: INK, fontSize: 14, fontWeight: '900' },
  userEmail: { marginTop: 4, color: '#7A8582', fontSize: 10, fontWeight: '600' },
  loginCard: { minHeight: 60, paddingHorizontal: 13, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE4DF' },
  loginIntro: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loginPrompt: { color: '#707A77', fontSize: 12, fontWeight: '700' },
  loginButton: { height: 34, paddingHorizontal: 12, borderRadius: 11, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: GREEN },
  loginButtonText: { color: INK, fontSize: 10, fontWeight: '900' },
  brandCard: { marginTop: 14, minHeight: 104, paddingHorizontal: 17, paddingVertical: 15, borderRadius: 17, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE4DF', borderLeftWidth: 3, borderLeftColor: GREEN },
  brandHeadline: { color: INK, fontSize: 19, lineHeight: 23, fontWeight: '900', letterSpacing: -0.3 },
  brandHighlight: { color: '#7DB400' },
  brandSignature: { marginTop: 7, color: '#78827F', fontSize: 10, fontWeight: '700' },
  brandSignatureGreen: { color: '#80B900' },
  separator: { height: 1, marginTop: 21, backgroundColor: '#DFE4DF' },
  menuLabelRow: { marginTop: 20, marginBottom: 11, flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuLabel: { color: '#818A87', fontSize: 8, fontWeight: '900', letterSpacing: 1.4 },
  menuLabelLine: { flex: 1, height: 1, backgroundColor: '#E0E4E0' },
  accessCard: { minHeight: 83, marginBottom: 13, padding: 13, borderRadius: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE4DF' },
  accessIcon: { width: 39, height: 39, borderRadius: 12, backgroundColor: '#F0F8D9', alignItems: 'center', justifyContent: 'center' },
  accessCopy: { flex: 1, marginLeft: 11 },
  accessTitle: { color: INK, fontSize: 12, fontWeight: '900' },
  accessText: { marginTop: 3, color: '#7A8481', fontSize: 9, lineHeight: 13, fontWeight: '600' },
  items: { gap: 6 },
  item: { minHeight: 61, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE4DF' },
  itemLocked: { backgroundColor: '#F0F2EF', borderColor: '#E3E6E3' },
  itemIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: '#F1F8DD', borderWidth: 1, borderColor: '#E3EADB', alignItems: 'center', justifyContent: 'center' },
  itemIconLocked: { backgroundColor: '#E8EBE8', borderColor: '#DFE3DF' },
  itemCopy: { flex: 1, marginLeft: 10 },
  itemLabel: { color: INK, fontSize: 12, fontWeight: '900' },
  itemLabelLocked: { color: '#929A97' },
  itemDescription: { marginTop: 2, color: '#8A9390', fontSize: 9, fontWeight: '600' },
  logoutButton: { height: 47, marginTop: 18, borderRadius: 13, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: '#F0CECB' },
  logoutText: { color: '#D44C45', fontSize: 11, fontWeight: '900' },
});
