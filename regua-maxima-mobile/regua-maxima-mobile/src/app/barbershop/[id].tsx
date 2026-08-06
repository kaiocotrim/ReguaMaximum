import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingSheet } from '@/components/booking-sheet';
import { SideMenu } from '@/components/side-menu';
import { BarbershopDetails, getBarbershop } from '@/services/barbershops';

const GREEN = '#BCF51A';
const INK = '#153D3E';
const BACKGROUND = '#F5F7F3';

function money(value: number) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export default function BarbershopScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [barbershop, setBarbershop] = useState<BarbershopDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'services' | 'reviews'>('services');
  const [favorited, setFavorited] = useState(false);
  const [bookingService, setBookingService] = useState<
    BarbershopDetails['services'][number] | null
  >(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadBarbershop = useCallback(async () => {
    if (!params.id) return;

    setLoading(true);
    setError(null);
    try {
      setBarbershop(await getBarbershop(params.id));
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Não foi possível carregar a barbearia.',
      );
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    void loadBarbershop();
  }, [loadBarbershop]);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/index');
  };

  const openMap = () => {
    if (!barbershop) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      barbershop.address,
    )}`;
    void Linking.openURL(url);
  };

  const shareBarbershop = () => {
    if (!barbershop) return;
    void Share.share({
      message: `Conheça a ${barbershop.name} na Régua Máxima! ${barbershop.address}`,
      title: barbershop.name,
    });
  };

  if (loading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator color={INK} size="large" />
        <Text style={styles.stateText}>Carregando barbearia...</Text>
      </View>
    );
  }

  if (error || !barbershop) {
    return (
      <View style={[styles.centerState, { paddingTop: insets.top }]}>
        <Ionicons name="alert-circle-outline" size={42} color="#728080" />
        <Text style={styles.stateTitle}>Não foi possível abrir</Text>
        <Text style={styles.stateText}>{error ?? 'Barbearia não encontrada.'}</Text>
        <TouchableOpacity activeOpacity={0.8} style={styles.primaryButton} onPress={loadBarbershop}>
          <Text style={styles.primaryButtonText}>TENTAR NOVAMENTE</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backLink}>Voltar para o início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image
            source={barbershop.capaUrl || barbershop.imageUrl}
            contentFit="cover"
            transition={250}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroShade} />

          <TouchableOpacity
            accessibilityLabel="Voltar"
            activeOpacity={0.8}
            style={[styles.floatingButton, styles.backButton, { top: insets.top + 10 }]}
            onPress={goBack}>
            <Ionicons name="chevron-back" size={23} color={INK} />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Menu"
            activeOpacity={0.8}
            style={[styles.floatingButton, styles.menuButton, { top: insets.top + 10 }]}
            onPress={() => setMenuOpen(true)}>
            <Ionicons name="menu" size={24} color={INK} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.logoRing}>
            <Image
              source={barbershop.imageUrl}
              contentFit="cover"
              transition={250}
              style={styles.logo}
            />
          </View>

          <View style={styles.profileGrid}>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{barbershop.name}</Text>
              <TouchableOpacity activeOpacity={0.7} style={styles.detailRow} onPress={openMap}>
                <Ionicons name="map-outline" size={17} color={INK} />
                <Text numberOfLines={2} style={styles.detailText}>{barbershop.address}</Text>
                <Ionicons name="open-outline" size={13} color="#8A9A99" />
              </TouchableOpacity>
              <View style={styles.detailRow}>
                <Ionicons name="star" size={16} color={INK} />
                <Text style={styles.detailText}>
                  {barbershop.averageRating === null
                    ? 'Novo'
                    : barbershop.averageRating.toFixed(1)}{' '}
                  · {barbershop.reviewCount}{' '}
                  {barbershop.reviewCount === 1 ? 'avaliação' : 'avaliações'}
                </Text>
              </View>
            </View>

            <View style={styles.profileActions}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.actionPill}
                onPress={() => setFavorited((current) => !current)}>
                <Ionicons
                  name={favorited ? 'heart' : 'heart-outline'}
                  size={17}
                  color={favorited ? '#78A000' : GREEN}
                />
                <Text style={styles.actionText}>{favorited ? 'Favorita' : 'Favoritar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.75} style={styles.actionPill} onPress={shareBarbershop}>
                <Ionicons name="share-outline" size={17} color={GREEN} />
                <Text style={styles.actionText}>Compartilhar</Text>
              </TouchableOpacity>
              <View style={styles.actionPill}>
                <Ionicons name="person-circle-outline" size={17} color={GREEN} />
                <Text style={styles.actionText}>
                  {barbershop.barbers.length}{' '}
                  {barbershop.barbers.length === 1 ? 'barbeiro' : 'barbeiros'}
                </Text>
              </View>
            </View>
          </View>

          {!barbershop.acceptsBookings ? (
            <View style={styles.closedNotice}>
              <Ionicons name="calendar-outline" size={18} color="#765A00" />
              <Text style={styles.closedText}>Agendamentos temporariamente pausados.</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.cardLabel}>SOBRE NÓS</Text>
          <Text style={styles.aboutText}>
            {barbershop.description?.trim() || 'Nenhuma descrição informada.'}
          </Text>
        </View>

        <View style={styles.tabsCard}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.tab, activeTab === 'services' && styles.activeTab]}
            onPress={() => setActiveTab('services')}>
            <Ionicons name="cut-outline" size={18} color={activeTab === 'services' ? '#102B2C' : '#717879'} />
            <Text style={[styles.tabText, activeTab === 'services' && styles.activeTabText]}>Serviços</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}>
            <Ionicons name="chatbox-outline" size={17} color={activeTab === 'reviews' ? '#102B2C' : '#717879'} />
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>Avaliações</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'services' ? (
          <View style={styles.list}>
            {barbershop.services.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="cut-outline" size={28} color="#82908E" />
                <Text style={styles.emptyTitle}>Nenhum serviço cadastrado</Text>
              </View>
            ) : (
              barbershop.services.map((service) => (
                <View key={service.id} style={styles.serviceCard}>
                  <Image
                    source={service.imageUrl}
                    contentFit="cover"
                    transition={200}
                    style={styles.serviceImage}
                  />
                  <View style={styles.serviceContent}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text numberOfLines={2} style={styles.serviceDescription}>
                      {service.description || 'Serviço profissional.'}
                    </Text>
                    <View style={styles.priceRow}>
                      <View>
                        <Text style={styles.servicePrice}>{money(service.price)}</Text>
                        <Text style={styles.duration}>{service.duration} min</Text>
                      </View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={!barbershop.acceptsBookings}
                        style={[
                          styles.scheduleButton,
                          !barbershop.acceptsBookings && styles.scheduleButtonDisabled,
                        ]}
                        onPress={() => setBookingService(service)}>
                        <Text style={styles.scheduleButtonText}>
                          {barbershop.acceptsBookings ? 'Agendar' : 'Pausado'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.list}>
            {barbershop.reviews.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="star-outline" size={30} color="#82908E" />
                <Text style={styles.emptyTitle}>Ainda não há avaliações</Text>
                <Text style={styles.emptyText}>Esta barbearia é nova na Régua Máxima.</Text>
              </View>
            ) : (
              barbershop.reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerAvatar}>
                      <Ionicons name="person" size={17} color={INK} />
                    </View>
                    <View style={styles.reviewMeta}>
                      <Text style={styles.reviewerName}>{review.userName}</Text>
                      <View style={styles.stars}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Ionicons
                            key={index}
                            name={index < review.rating ? 'star' : 'star-outline'}
                            size={13}
                            color="#E4AE00"
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  {review.comment ? <Text style={styles.reviewText}>{review.comment}</Text> : null}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {bookingService ? (
        <BookingSheet
          visible
          service={bookingService}
          barbershop={barbershop}
          onClose={() => setBookingService(null)}
        />
      ) : null}
      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BACKGROUND },
  content: { paddingBottom: 115 },
  hero: { height: 260, overflow: 'hidden', borderBottomLeftRadius: 28, borderBottomRightRadius: 28, backgroundColor: '#D9DEDA' },
  heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.08)' },
  floatingButton: { position: 'absolute', width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  backButton: { left: 18 },
  menuButton: { right: 18 },
  profileSection: { paddingHorizontal: 27, paddingTop: 55, paddingBottom: 20, backgroundColor: '#FFFFFF' },
  logoRing: { position: 'absolute', top: -39, left: 27, width: 82, height: 82, borderRadius: 41, padding: 5, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 5 },
  logo: { width: '100%', height: '100%', borderRadius: 36, backgroundColor: '#E5E9E5' },
  profileGrid: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  profileInfo: { flex: 1, paddingRight: 4 },
  name: { color: '#62C900', fontSize: 24, lineHeight: 29, fontWeight: '900', letterSpacing: -0.5 },
  detailRow: { marginTop: 9, flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { flexShrink: 1, color: INK, fontSize: 12, lineHeight: 16, fontWeight: '800' },
  profileActions: { alignItems: 'stretch', gap: 7 },
  actionPill: { minHeight: 31, paddingHorizontal: 10, borderRadius: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#FAFBF9' },
  actionText: { color: '#102F30', fontSize: 10, fontWeight: '800' },
  closedNotice: { marginTop: 16, minHeight: 42, paddingHorizontal: 13, borderRadius: 12, backgroundColor: '#FFF2C4', flexDirection: 'row', alignItems: 'center', gap: 8 },
  closedText: { flex: 1, color: '#765A00', fontSize: 12, fontWeight: '800' },
  aboutCard: { marginHorizontal: 27, marginTop: 24, minHeight: 98, borderRadius: 18, borderWidth: 1, borderColor: '#DDE2DE', backgroundColor: '#F9FAF8', padding: 16 },
  cardLabel: { color: INK, fontSize: 12, fontWeight: '900' },
  aboutText: { marginTop: 25, color: INK, fontSize: 12, lineHeight: 18, fontWeight: '700' },
  tabsCard: { marginHorizontal: 27, marginTop: 30, height: 56, padding: 6, borderRadius: 18, flexDirection: 'row', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4E7E3', shadowColor: '#102F30', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  tab: { flex: 1, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  activeTab: { backgroundColor: GREEN },
  tabText: { color: '#717879', fontSize: 12, fontWeight: '800' },
  activeTabText: { color: '#102B2C', fontWeight: '900' },
  list: { marginHorizontal: 27, marginTop: 18, gap: 14 },
  serviceCard: { minHeight: 136, padding: 12, borderRadius: 19, flexDirection: 'row', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E6E2', shadowColor: '#143D3E', shadowOpacity: 0.06, shadowRadius: 7, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  serviceImage: { width: 108, minHeight: 112, borderRadius: 14, backgroundColor: '#DDE3DE', borderWidth: 1, borderColor: GREEN },
  serviceContent: { flex: 1, paddingLeft: 14, paddingVertical: 1 },
  serviceName: { color: '#2B5555', fontSize: 16, lineHeight: 20, fontWeight: '900' },
  serviceDescription: { marginTop: 6, color: '#727776', fontSize: 10, lineHeight: 14, fontWeight: '600' },
  priceRow: { flex: 1, marginTop: 9, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
  servicePrice: { color: '#416566', fontSize: 17, fontWeight: '900' },
  duration: { marginTop: 1, color: '#8A9290', fontSize: 9, fontWeight: '700' },
  scheduleButton: { minWidth: 82, height: 31, paddingHorizontal: 11, borderRadius: 10, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center' },
  scheduleButtonDisabled: { backgroundColor: '#D9DDD8' },
  scheduleButtonText: { color: '#0D2526', fontSize: 10, fontWeight: '900' },
  emptyCard: { minHeight: 140, borderRadius: 19, padding: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E6E2', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { marginTop: 8, color: INK, fontSize: 14, fontWeight: '900', textAlign: 'center' },
  emptyText: { marginTop: 5, color: '#778381', fontSize: 11, fontWeight: '600', textAlign: 'center' },
  reviewCard: { minHeight: 105, borderRadius: 18, padding: 15, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E6E2' },
  reviewHeader: { flexDirection: 'row', alignItems: 'center' },
  reviewerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center' },
  reviewMeta: { marginLeft: 10 },
  reviewerName: { color: INK, fontSize: 13, fontWeight: '900' },
  stars: { marginTop: 3, flexDirection: 'row', gap: 2 },
  reviewText: { marginTop: 11, color: '#5F6B69', fontSize: 12, lineHeight: 17, fontWeight: '600' },
  centerState: { flex: 1, paddingHorizontal: 30, backgroundColor: BACKGROUND, alignItems: 'center', justifyContent: 'center' },
  stateTitle: { marginTop: 12, color: INK, fontSize: 19, fontWeight: '900', textAlign: 'center' },
  stateText: { marginTop: 9, color: '#75807E', fontSize: 13, lineHeight: 19, fontWeight: '600', textAlign: 'center' },
  primaryButton: { marginTop: 20, height: 42, borderRadius: 12, paddingHorizontal: 18, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#102B2C', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  backLink: { marginTop: 18, color: INK, fontSize: 12, fontWeight: '800' },
});
