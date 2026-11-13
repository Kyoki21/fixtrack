import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSettings } from '../context/SettingsContext';
import { STATUSES, useOrders } from '../context/OrdersContext';
import AppText from '../components/AppText';
import Button from '../components/Button';
import Card from '../components/Card';
import Chip from '../components/Chip';
import EmptyState from '../components/EmptyState';
import Screen from '../components/Screen';
import SectionTitle from '../components/SectionTitle';
import StatusBadge from '../components/StatusBadge';

const LABELS = { inProgress: 'statusInProgress', waiting: 'statusWaiting', ready: 'statusReady' };

export default function OrderDetailScreen({ route, navigation }) {
  const { theme, t } = useSettings();
  const { orders, setStatus, removeOrder } = useOrders();
  const order = orders.find((o) => o.id === route.params.id);

  if (!order) {
    return (
      <Screen>
        <EmptyState text={t('noOrders')} />
      </Screen>
    );
  }

  const rows = [
    [t('device'), order.device],
    [t('service'), order.service],
    [t('client'), order.client],
    [t('phone'), order.phone],
    [t('date'), order.date],
  ];

  const confirmDelete = () => {
    Alert.alert(t('deleteTitle'), t('deleteText'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: () => {
          removeOrder(order.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <Screen>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <AppText size={20} weight="800">
            {'#' + order.id}
          </AppText>
          <StatusBadge status={order.status} />
        </View>
        {rows.map(([k, v]) => (
          <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: theme.border }}>
            <AppText size={14} color={theme.sub}>
              {k}
            </AppText>
            <AppText size={14} weight="600" style={{ flexShrink: 1, textAlign: 'right', marginLeft: 12 }}>
              {v}
            </AppText>
          </View>
        ))}
        {order.note ? (
          <View style={{ paddingTop: 8, borderTopWidth: 1, borderTopColor: theme.border }}>
            <AppText size={14} color={theme.sub}>
              {t('note')}
            </AppText>
            <AppText size={14} style={{ marginTop: 2 }}>
              {order.note}
            </AppText>
          </View>
        ) : null}
      </Card>

      <SectionTitle>{t('changeStatus')}</SectionTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {STATUSES.map((s) => (
          <Chip
            key={s}
            label={t(LABELS[s])}
            active={order.status === s}
            onPress={() => {
              Haptics.selectionAsync();
              setStatus(order.id, s);
            }}
          />
        ))}
      </ScrollView>

      <Button title={t('delete')} icon="trash-outline" variant="danger" onPress={confirmDelete} style={{ marginTop: 28 }} />
    </Screen>
  );
}
