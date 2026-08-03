import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BarbershopDetails,
  getAvailableBarbers,
  getAvailableTimes,
} from '@/services/barbershops';

const GREEN = '#BCF51A';
const INK = '#153F40';
const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

type BookingService = BarbershopDetails['services'][number];

type BookingSheetProps = {
  visible: boolean;
  service: BookingService;
  barbershop: BarbershopDetails;
  onClose: () => void;
};

type CalendarDay = {
  key: string;
  day: number;
  currentMonth: boolean;
};

function dateKey(year: number, month: number, day: number) {
  return [year, String(month + 1).padStart(2, '0'), String(day).padStart(2, '0')].join('-');
}

function todayKey() {
  const now = new Date();
  return dateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

function calendarDays(month: Date): CalendarDay[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = new Date(year, monthIndex, 1, 12).getDay();
  const currentMonthDays = new Date(year, monthIndex + 1, 0, 12).getDate();
  const previousMonthDays = new Date(year, monthIndex, 0, 12).getDate();

  return Array.from({ length: 42 }).map((_, index) => {
    const rawDay = index - firstWeekday + 1;

    if (rawDay < 1) {
      const day = previousMonthDays + rawDay;
      const previous = new Date(year, monthIndex - 1, day, 12);
      return {
        key: dateKey(previous.getFullYear(), previous.getMonth(), day),
        day,
        currentMonth: false,
      };
    }

    if (rawDay > currentMonthDays) {
      const day = rawDay - currentMonthDays;
      const next = new Date(year, monthIndex + 1, day, 12);
      return {
        key: dateKey(next.getFullYear(), next.getMonth(), day),
        day,
        currentMonth: false,
      };
    }

    return { key: dateKey(year, monthIndex, rawDay), day: rawDay, currentMonth: true };
  });
}

function monthLabel(month: Date) {
  const label = month.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return label.replace(/^./, (letter) => letter.toUpperCase());
}

function selectedDateLabel(key: string) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day, 12).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

export function BookingSheet({ visible, service, barbershop, onClose }: BookingSheetProps) {
  const insets = useSafeAreaInsets();
  const now = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(now.getFullYear(), now.getMonth(), 1, 12),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableBarberIds, setAvailableBarberIds] = useState<string[]>([]);
  const [firstTimes, setFirstTimes] = useState<Record<string, string>>({});
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [checkingBarbers, setCheckingBarbers] = useState(false);
  const [checkingTimes, setCheckingTimes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const days = useMemo(() => calendarDays(visibleMonth), [visibleMonth]);

  const availableBarbers = barbershop.barbers.filter((barber) =>
    availableBarberIds.includes(barber.id),
  );
  const selectedBarber = barbershop.barbers.find((barber) => barber.id === selectedBarberId);

  useEffect(() => {
    if (!selectedDate) return;
    let active = true;

    setCheckingBarbers(true);
    setError(null);
    void getAvailableBarbers({
      barbershopId: barbershop.id,
      serviceId: service.id,
      date: selectedDate,
    })
      .then((result) => {
        if (!active) return;
        setAvailableBarberIds(result.barberIds);
        setFirstTimes(result.firstTimes);
      })
      .catch((loadError) => {
        if (!active) return;
        setAvailableBarberIds([]);
        setError(
          loadError instanceof Error ? loadError.message : 'Não foi possível consultar os barbeiros.',
        );
      })
      .finally(() => {
        if (active) setCheckingBarbers(false);
      });

    return () => {
      active = false;
    };
  }, [barbershop.id, selectedDate, service.id]);

  useEffect(() => {
    if (!selectedDate || !selectedBarberId) return;
    let active = true;

    setCheckingTimes(true);
    setError(null);
    void getAvailableTimes({
      barbershopId: barbershop.id,
      serviceId: service.id,
      barberId: selectedBarberId,
      date: selectedDate,
    })
      .then((times) => {
        if (active) setAvailableTimes(times);
      })
      .catch((loadError) => {
        if (!active) return;
        setAvailableTimes([]);
        setError(
          loadError instanceof Error ? loadError.message : 'Não foi possível consultar os horários.',
        );
      })
      .finally(() => {
        if (active) setCheckingTimes(false);
      });

    return () => {
      active = false;
    };
  }, [barbershop.id, selectedBarberId, selectedDate, service.id]);

  const close = () => {
    setSelectedDate(null);
    setSelectedBarberId(null);
    setSelectedTime(null);
    setAvailableBarberIds([]);
    setAvailableTimes([]);
    setError(null);
    onClose();
  };

  const chooseDate = (day: CalendarDay) => {
    if (day.key < todayKey()) return;

    setSelectedDate(day.key);
    setSelectedBarberId(null);
    setSelectedTime(null);
    setAvailableBarberIds([]);
    setAvailableTimes([]);
    setError(null);
  };

  const changeDate = () => {
    setSelectedDate(null);
    setSelectedBarberId(null);
    setSelectedTime(null);
    setAvailableBarberIds([]);
    setAvailableTimes([]);
    setError(null);
  };

  const chooseBarber = (barberId: string) => {
    setSelectedBarberId(barberId);
    setSelectedTime(null);
    setAvailableTimes([]);
    setError(null);
  };

  const confirm = () => {
    if (!selectedDate || !selectedBarber || !selectedTime) return;
    Alert.alert(
      'Login necessário',
      `Seu horário de ${service.name} foi selecionado para ${selectedDateLabel(selectedDate)}, às ${selectedTime}, com ${selectedBarber.name}. Entre na sua conta para confirmar.`,
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={close}>
      <View style={styles.modalRoot}>
        <BlurView
          tint="light"
          intensity={30}
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />
        <Pressable style={styles.backdrop} onPress={close} />

        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Agende seu horário</Text>
            <TouchableOpacity accessibilityLabel="Fechar" style={styles.closeIcon} onPress={close}>
              <Ionicons name="close" size={22} color={INK} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetContent}>
            {!selectedDate ? (
              <View>
                <Text style={styles.stepTitle}>1. Escolha a data</Text>

                <View style={styles.monthNavigation}>
                  <TouchableOpacity
                    accessibilityLabel="Mês anterior"
                    style={styles.monthButton}
                    onPress={() =>
                      setVisibleMonth(
                        (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1, 12),
                      )
                    }>
                    <Ionicons name="chevron-back" size={18} color="#89C900" />
                  </TouchableOpacity>
                  <Text style={styles.monthTitle}>{monthLabel(visibleMonth)}</Text>
                  <TouchableOpacity
                    accessibilityLabel="Próximo mês"
                    style={styles.monthButton}
                    onPress={() =>
                      setVisibleMonth(
                        (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1, 12),
                      )
                    }>
                    <Ionicons name="chevron-forward" size={18} color="#89C900" />
                  </TouchableOpacity>
                </View>

                <View style={styles.weekRow}>
                  {WEEKDAYS.map((weekday) => (
                    <Text key={weekday} style={styles.weekday}>{weekday}</Text>
                  ))}
                </View>

                <View style={styles.calendarGrid}>
                  {days.map((day) => {
                    const disabled = day.key < todayKey();
                    const isToday = day.key === todayKey();
                    return (
                      <TouchableOpacity
                        key={day.key}
                        activeOpacity={disabled ? 1 : 0.75}
                        disabled={disabled}
                        style={[styles.dayCell, isToday && styles.todayCell]}
                        onPress={() => chooseDate(day)}>
                        <Text
                          style={[
                            styles.dayText,
                            !day.currentMonth && styles.otherMonthDay,
                            disabled && styles.disabledDay,
                          ]}>
                          {day.day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.selectedDateCard}>
                  <View>
                    <Text style={styles.selectedDateLabel}>Data escolhida</Text>
                    <Text style={styles.selectedDateText}>{selectedDateLabel(selectedDate)}</Text>
                  </View>
                  <TouchableOpacity onPress={changeDate}>
                    <Text style={styles.changeDate}>Trocar data</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.flowStepTitle}>2. Escolha um barbeiro disponível</Text>

                {checkingBarbers ? (
                  <View style={styles.loadingBox}>
                    <ActivityIndicator color={INK} />
                    <Text style={styles.loadingText}>Consultando barbeiros...</Text>
                  </View>
                ) : availableBarbers.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>Não há barbeiros com horários disponíveis nesta data.</Text>
                  </View>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.barberList}>
                    {availableBarbers.map((barber) => {
                      const selected = selectedBarberId === barber.id;
                      const initials = barber.name
                        .split(' ')
                        .map((name) => name[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <TouchableOpacity
                          key={barber.id}
                          activeOpacity={0.8}
                          style={[styles.barberCard, selected && styles.barberCardSelected]}
                          onPress={() => chooseBarber(barber.id)}>
                          <View style={[styles.avatarBox, selected && styles.avatarBoxSelected]}>
                            {barber.avatar ? (
                              <Image source={barber.avatar} contentFit="cover" style={styles.avatar} />
                            ) : (
                              <Text style={styles.initials}>{initials}</Text>
                            )}
                          </View>
                          <Text numberOfLines={1} style={styles.barberName}>{barber.name}</Text>
                          <Text style={styles.barberMeta}>
                            R$ {service.price.toFixed(2).replace('.', ',')} · {service.duration} min
                          </Text>
                          {firstTimes[barber.id] ? (
                            <Text style={styles.firstTime}>Primeiro: {firstTimes[barber.id]}</Text>
                          ) : null}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}

                {selectedBarberId ? (
                  <View style={styles.timesSection}>
                    <Text style={styles.flowStepTitle}>
                      3. Escolha um horário com{' '}
                      <Text style={styles.barberHighlight}>{selectedBarber?.name}</Text>
                    </Text>

                    {checkingTimes ? (
                      <View style={styles.loadingBox}>
                        <ActivityIndicator color={INK} />
                        <Text style={styles.loadingText}>Consultando horários...</Text>
                      </View>
                    ) : availableTimes.length === 0 ? (
                      <View style={styles.emptyBox}>
                        <Text style={styles.emptyText}>Não há mais horários para este barbeiro.</Text>
                      </View>
                    ) : (
                      <View style={styles.timesGrid}>
                        {availableTimes.map((time) => {
                          const selected = selectedTime === time;
                          return (
                            <TouchableOpacity
                              key={time}
                              activeOpacity={0.8}
                              style={[styles.timeButton, selected && styles.timeButtonSelected]}
                              onPress={() => setSelectedTime(time)}>
                              <Text style={[styles.timeText, selected && styles.timeTextSelected]}>{time}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  </View>
                ) : null}

                {selectedBarberId && selectedTime ? (
                  <TouchableOpacity activeOpacity={0.8} style={styles.confirmButton} onPress={confirm}>
                    <Text style={styles.confirmText}>Confirmar para {selectedTime}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity activeOpacity={0.8} style={styles.closeButton} onPress={close}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(18,31,36,0.22)' },
  sheet: { maxHeight: '88%', minHeight: 515, borderTopLeftRadius: 27, borderTopRightRadius: 27, overflow: 'hidden', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDE3DF' },
  handle: { width: 64, height: 4, borderRadius: 2, marginTop: 12, alignSelf: 'center', backgroundColor: '#EEF0ED' },
  sheetHeader: { minHeight: 64, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E8EBE8' },
  sheetTitle: { color: INK, fontSize: 18, fontWeight: '900' },
  closeIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  sheetContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 22 },
  stepTitle: { color: INK, fontSize: 13, fontWeight: '900', textAlign: 'center' },
  monthNavigation: { marginTop: 24, marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32 },
  monthButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  monthTitle: { minWidth: 130, color: GREEN, fontSize: 13, fontWeight: '900', textAlign: 'center' },
  weekRow: { flexDirection: 'row' },
  weekday: { width: '14.285%', color: '#777D7B', fontSize: 10, fontWeight: '800', textAlign: 'center' },
  calendarGrid: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.285%', height: 35, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  todayCell: { backgroundColor: '#F0F3F0' },
  dayText: { color: INK, fontSize: 13, fontWeight: '800' },
  otherMonthDay: { color: '#858A88' },
  disabledDay: { color: '#D4D7D4' },
  selectedDateCard: { marginBottom: 20, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F5F6F4', borderWidth: 1, borderColor: '#E0E4E0' },
  selectedDateLabel: { color: '#7A817F', fontSize: 10, fontWeight: '700' },
  selectedDateText: { marginTop: 3, color: INK, fontSize: 12, fontWeight: '900' },
  changeDate: { color: '#6EA700', fontSize: 10, fontWeight: '900', textDecorationLine: 'underline' },
  flowStepTitle: { color: INK, fontSize: 13, lineHeight: 18, fontWeight: '900' },
  barberHighlight: { color: '#659A00' },
  barberList: { gap: 11, paddingTop: 13, paddingBottom: 8, paddingRight: 6 },
  barberCard: { width: 126, minHeight: 151, borderRadius: 15, padding: 12, alignItems: 'center', backgroundColor: '#F5F6F4', borderWidth: 2, borderColor: '#E0E4E0' },
  barberCardSelected: { borderColor: GREEN, backgroundColor: '#FBFFF1' },
  avatarBox: { width: 51, height: 51, borderRadius: 26, overflow: 'hidden', backgroundColor: '#E1E5E1', alignItems: 'center', justifyContent: 'center' },
  avatarBoxSelected: { borderWidth: 2, borderColor: GREEN },
  avatar: { width: '100%', height: '100%' },
  initials: { color: INK, fontSize: 13, fontWeight: '900' },
  barberName: { width: '100%', marginTop: 8, color: INK, fontSize: 11, fontWeight: '900', textAlign: 'center' },
  barberMeta: { marginTop: 4, color: '#77807D', fontSize: 8, fontWeight: '700', textAlign: 'center' },
  firstTime: { marginTop: 7, borderRadius: 9, overflow: 'hidden', paddingHorizontal: 7, paddingVertical: 4, backgroundColor: '#EDFAC9', color: '#609000', fontSize: 8, fontWeight: '900' },
  timesSection: { marginTop: 18, paddingTop: 17, borderTopWidth: 1, borderTopColor: '#E5E8E5' },
  timesGrid: { marginTop: 13, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeButton: { width: '23.3%', height: 38, borderRadius: 10, backgroundColor: '#F1F3F0', alignItems: 'center', justifyContent: 'center' },
  timeButtonSelected: { backgroundColor: GREEN },
  timeText: { color: INK, fontSize: 11, fontWeight: '800' },
  timeTextSelected: { fontWeight: '900' },
  confirmButton: { height: 45, marginTop: 18, borderRadius: 12, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center' },
  confirmText: { color: INK, fontSize: 12, fontWeight: '900' },
  loadingBox: { minHeight: 92, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 8, color: '#76807D', fontSize: 10, fontWeight: '700' },
  emptyBox: { minHeight: 85, marginTop: 10, padding: 14, borderRadius: 12, backgroundColor: '#F5F6F4', alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#76807D', fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  errorText: { marginTop: 13, color: '#B5443B', fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  footer: { paddingHorizontal: 16, paddingTop: 13, borderTopWidth: 1, borderTopColor: '#E6E9E6' },
  closeButton: { height: 36, borderRadius: 10, backgroundColor: '#F5F6F4', borderWidth: 1, borderColor: '#DFE3DF', alignItems: 'center', justifyContent: 'center' },
  closeButtonText: { color: INK, fontSize: 11, fontWeight: '900' },
});
