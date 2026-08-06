import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SideMenu } from '@/components/side-menu';
import {
  Barbershop,
  getPublicAssetUrl,
  listBarbershops,
} from '@/services/barbershops';

const GREEN = '#BCF51A';
const INK = '#153F40';
const BACKGROUND = '#F8F9F7';

const categories = [
  { label: 'Cabelo', service: 'Cabelo', icon: 'cut-outline' as const },
  { label: 'Barba', service: 'Barba', icon: 'flask-outline' as const },
  { label: 'Acabamento', service: 'Acabamento', icon: 'color-wand-outline' as const },
  { label: 'Barbearias', service: null, icon: 'storefront-outline' as const },
  { label: 'Sobrancelha', service: 'Sobrancelha', icon: 'sparkles-outline' as const },
];

function currentDateLabel() {
  const value = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date());

  return value.replace(/^./, (letter) => letter.toUpperCase());
}

export default function HomeScreen() {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [search, setSearch] = useState('');
  const [activeService, setActiveService] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dateLabel = useMemo(currentDateLabel, []);
  const logoUrl = getPublicAssetUrl('/LogoMComBorder3.png');
  const bannerUrl = getPublicAssetUrl('/bannerReguaM-light1.png');

  const loadBarbershops = useCallback(
    async (
      filters?: { search?: string; service?: string },
      options?: { refresh?: boolean },
    ) => {
      if (options?.refresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        setBarbershops(await listBarbershops(filters));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Não foi possível carregar as barbearias.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadBarbershops();
  }, [loadBarbershops]);

  const openBarbershop = (id: string) => {
    router.push({ pathname: '/barbershop/[id]', params: { id } });
  };

  const handleSearch = () => {
    setActiveService(null);
    void loadBarbershops(search.trim() ? { search } : undefined);
  };

  const selectCategory = (service: string | null) => {
    setSearch('');
    setActiveService(service);
    void loadBarbershops(service ? { service } : undefined);
  };

  const showAll = () => {
    setSearch('');
    setActiveService(null);
    void loadBarbershops();
  };

  const refresh = () => {
    const filters = activeService
      ? { service: activeService }
      : search.trim()
        ? { search }
        : undefined;
    void loadBarbershops(filters, { refresh: true });
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          {logoUrl ? (
            <Image source={logoUrl} contentFit="contain" style={styles.logo} />
          ) : (
            <View style={styles.logoFallback}>
              <Ionicons name="resize-outline" size={23} color={INK} />
            </View>
          )}

          <TouchableOpacity
            accessibilityLabel="Abrir menu"
            activeOpacity={0.75}
            style={styles.menuButton}
            onPress={() => setMenuOpen(true)}>
            <Ionicons name="menu-outline" size={26} color={INK} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} tintColor={INK} onRefresh={refresh} />}
          contentContainerStyle={styles.content}>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>
              Olá, <Text style={styles.greetingHighlight}>iremos alinhar o cabelo?</Text>
            </Text>
            <Text style={styles.date}>{dateLabel}</Text>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <TextInput
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                placeholder="Pesquise por barbearias e serviços..."
                placeholderTextColor="#747D7D"
                style={styles.searchInput}
              />
            </View>
            <TouchableOpacity
              accessibilityLabel="Pesquisar"
              activeOpacity={0.8}
              style={styles.searchButton}
              onPress={handleSearch}>
              <Ionicons name="search" size={22} color={GREEN} />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}>
            {categories.map((category) => {
              const selected = category.service === activeService && activeService !== null;
              return (
                <TouchableOpacity
                  key={category.label}
                  activeOpacity={0.8}
                  style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                  onPress={() => selectCategory(category.service)}>
                  <Ionicons name={category.icon} size={16} color={INK} />
                  <Text style={styles.categoryText}>{category.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            activeOpacity={0.9}
            disabled={barbershops.length === 0}
            style={styles.banner}
            onPress={() => barbershops[0] && openBarbershop(barbershops[0].id)}>
            {bannerUrl ? (
              <Image source={bannerUrl} contentFit="cover" transition={250} style={styles.bannerImage} />
            ) : (
              <View style={styles.bannerFallback}>
                <Text style={styles.bannerTitle}>Agende nos melhores</Text>
                <Text style={styles.bannerSubtitle}>profissionais perto de você</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeService ? `BARBEARIAS COM ${activeService.toUpperCase()}` : 'RECOMENDAÇÕES'}
            </Text>
            <View style={styles.sectionActions}>
              <TouchableOpacity onPress={showAll}>
                <Text style={styles.allText}>Todas</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/explore')}>
                <Text style={styles.mapText}>Mapa</Text>
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View style={styles.feedbackBox}>
              <ActivityIndicator size="small" color={INK} />
              <Text style={styles.feedbackText}>Buscando barbearias...</Text>
            </View>
          ) : error ? (
            <View style={styles.feedbackBox}>
              <Ionicons name="cloud-offline-outline" size={28} color="#72807F" />
              <Text style={styles.feedbackTitle}>Não foi possível conectar</Text>
              <Text style={styles.feedbackText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={showAll}>
                <Text style={styles.retryText}>TENTAR NOVAMENTE</Text>
              </TouchableOpacity>
            </View>
          ) : barbershops.length === 0 ? (
            <View style={styles.feedbackBox}>
              <Ionicons name="search-outline" size={28} color="#72807F" />
              <Text style={styles.feedbackTitle}>Nenhuma barbearia encontrada</Text>
              <Text style={styles.feedbackText}>Tente outro nome ou serviço.</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {barbershops.map((barbershop) => (
                <View key={barbershop.id} style={styles.card}>
                  <TouchableOpacity activeOpacity={0.85} onPress={() => openBarbershop(barbershop.id)}>
                    <View style={styles.imageBox}>
                      <Image
                        source={barbershop.imageUrl}
                        contentFit="cover"
                        transition={220}
                        style={styles.cardImage}
                      />
                      <View style={styles.badge}>
                        <Ionicons name="star" size={11} color={INK} />
                        <Text style={styles.badgeText}>
                          {barbershop.averageRating === null
                            ? 'Novo'
                            : barbershop.averageRating.toFixed(1)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardInfo}>
                      <Text numberOfLines={1} style={styles.cardName}>{barbershop.name}</Text>
                      <Text numberOfLines={1} style={styles.cardAddress}>{barbershop.address}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.scheduleButton}
                    onPress={() => openBarbershop(barbershop.id)}>
                    <Text style={styles.scheduleText}>Agendar</Text>
                    <Ionicons name="chevron-forward" size={17} color={INK} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BACKGROUND },
  safeArea: { flex: 1 },
  header: { height: 65, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E8E5' },
  logo: { width: 56, height: 39 },
  logoFallback: { width: 52, height: 34, borderRadius: 8, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center' },
  menuButton: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 115 },
  greetingSection: { marginBottom: 25 },
  greeting: { color: INK, fontSize: 20, lineHeight: 27, fontWeight: '900', letterSpacing: -0.45 },
  greetingHighlight: { color: '#64D100' },
  date: { marginTop: 4, color: '#6A7372', fontSize: 12, fontWeight: '800' },
  searchRow: { height: 48, flexDirection: 'row', gap: 10 },
  searchBox: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: '#E1E5E1', backgroundColor: '#FFFFFF', justifyContent: 'center' },
  searchInput: { height: '100%', paddingHorizontal: 12, color: INK, fontSize: 12, fontWeight: '700' },
  searchButton: { width: 47, height: 47, borderRadius: 12, backgroundColor: INK, alignItems: 'center', justifyContent: 'center' },
  categories: { gap: 10, paddingTop: 20, paddingBottom: 3, paddingRight: 5 },
  categoryChip: { height: 36, paddingHorizontal: 15, borderRadius: 11, flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#FFFFFF' },
  categoryChipSelected: { backgroundColor: GREEN },
  categoryText: { color: INK, fontSize: 11, fontWeight: '900' },
  banner: { height: 150, marginTop: 27, borderRadius: 19, overflow: 'hidden', backgroundColor: '#EAF4DF', borderWidth: 1, borderColor: '#E0E5DF', shadowColor: '#102F30', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  bannerImage: { width: '100%', height: '100%' },
  bannerFallback: { flex: 1, padding: 24, justifyContent: 'center' },
  bannerTitle: { color: INK, fontSize: 25, fontWeight: '900' },
  bannerSubtitle: { marginTop: 3, color: '#69CD0A', fontSize: 17, fontWeight: '800' },
  sectionHeader: { marginTop: 23, marginBottom: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { flex: 1, color: INK, fontSize: 10, fontWeight: '900' },
  sectionActions: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  allText: { color: '#6A7372', fontSize: 10, fontWeight: '900' },
  mapText: { color: '#66D000', fontSize: 10, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 },
  card: { width: '48.45%', padding: 9, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DEE4DF' },
  imageBox: { width: '100%', aspectRatio: 1.24, borderRadius: 14, overflow: 'hidden', backgroundColor: '#DFE4DF' },
  cardImage: { width: '100%', height: '100%' },
  badge: { position: 'absolute', top: 5, left: 5, minHeight: 21, paddingHorizontal: 8, borderRadius: 11, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: GREEN },
  badgeText: { color: INK, fontSize: 9, fontWeight: '900' },
  cardInfo: { minHeight: 53, paddingTop: 11, paddingHorizontal: 1 },
  cardName: { color: INK, fontSize: 11, fontWeight: '900' },
  cardAddress: { marginTop: 4, color: '#737B79', fontSize: 10, fontWeight: '700' },
  scheduleButton: { height: 32, borderRadius: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: GREEN },
  scheduleText: { color: INK, fontSize: 11, fontWeight: '900' },
  feedbackBox: { minHeight: 155, borderRadius: 18, padding: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E5E0', alignItems: 'center', justifyContent: 'center' },
  feedbackTitle: { marginTop: 8, color: INK, fontSize: 14, fontWeight: '900', textAlign: 'center' },
  feedbackText: { marginTop: 7, color: '#74807E', fontSize: 11, lineHeight: 16, fontWeight: '600', textAlign: 'center' },
  retryButton: { marginTop: 14, height: 36, borderRadius: 10, paddingHorizontal: 15, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center' },
  retryText: { color: INK, fontSize: 10, fontWeight: '900' },
});
