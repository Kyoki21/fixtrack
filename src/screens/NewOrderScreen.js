import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSettings } from '../context/SettingsContext';
import { STATUSES, useOrders } from '../context/OrdersContext';
import AppText from '../components/AppText';
import Button from '../components/Button';
import Chip from '../components/Chip';
import Input from '../components/Input';
import Screen from '../components/Screen';
import { formatToday, validateOrder } from '../utils/validation';

const LABELS = { inProgress: 'statusInProgress', waiting: 'statusWaiting', ready: 'statusReady' };

const emptyForm = () => ({
  client: '',
  phone: '',
  device: '',
  service: '',
  date: formatToday(),
  note: '',
  status: 'inProgress',
});

export default function NewOrderScreen({ route, navigation }) {
  const { theme, t } = useSettings();
  const { addOrder } = useOrders();
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const c = route.params && route.params.client;
    if (c) setForm((f) => ({ ...f, client: c.name, phone: c.phone }));
  }, [route.params]);

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const errText = (code) => {
    if (!code) return undefined;
    return t({ short: 'errShort', phone: 'errPhone', date: 'errDate' }[code]);
  };

  const submit = () => {
    const found = validateOrder(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    addOrder({
      client: form.client.trim(),
      phone: form.phone.trim(),
      device: form.device.trim(),
      service: form.service.trim(),
      date: form.date.trim(),
      note: form.note.trim(),
      status: form.status,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setForm(emptyForm());
    navigation.setParams({ client: undefined });
    Alert.alert(t('orderCreated'));
    navigation.navigate('Orders');
  };

  return (
    <Screen>
      <Input label={t('clientName')} value={form.client} onChangeText={set('client')} error={errText(errors.client)} />
      <Input label={t('phone')} value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" placeholder="+7 700 000 00 00" error={errText(errors.phone)} />
      <Input label={t('device')} value={form.device} onChangeText={set('device')} placeholder={t('deviceHint')} error={errText(errors.device)} />
      <Input label={t('service')} value={form.service} onChangeText={set('service')} placeholder={t('serviceHint')} error={errText(errors.service)} />
      <Input label={t('date')} value={form.date} onChangeText={set('date')} placeholder={t('dateHint')} keyboardType="numbers-and-punctuation" error={errText(errors.date)} />
      <Input label={t('note')} value={form.note} onChangeText={set('note')} multiline style={{ minHeight: 80, textAlignVertical: 'top' }} />
      <AppText size={13} weight="600" color={theme.sub} style={{ marginBottom: 8 }}>
        {t('status')}
      </AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {STATUSES.map((s) => (
          <Chip key={s} label={t(LABELS[s])} active={form.status === s} onPress={() => set('status')(s)} />
        ))}
      </ScrollView>
      <Button title={t('save')} icon="save-outline" onPress={submit} />
    </Screen>
  );
}
