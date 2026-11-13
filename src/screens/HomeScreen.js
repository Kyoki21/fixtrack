import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrdersContext';
import AppText from '../components/AppText';
import Button from '../components/Button';
import Card from '../components/Card';
import OrderCard from '../components/OrderCard';
import Screen from '../components/Screen';
import SectionTitle from '../components/SectionTitle';
import { statusColors } from '../components/StatusBadge';

export default function HomeScreen({ navigation }) {
  const { theme, t, settings } = useSettings();
  const { orders } = useOrders();
  const count = (s) => orders.filter((o) => o.status === s).length;
  const tiles = [
    { key: 'inProgress', label: t('statusInProgress'), icon: 'construct' },
    { key: 'waiting', label: t('statusWaiting'), icon: 'hourglass' },
    { key: 'ready', label: t('statusReady'), icon: 'checkmark-circle' },
  ];
  const firstName = settings.profile.name.split(' ')[0];

  return (
    <Screen>
      <Card style={{ backgroundColor: theme.primary, borderColor: theme.primary }}>
        <AppText size={14} color={theme.onPrimary} style={{ opacity: 0.85 }}>
          {t('hello') + ','}
        </AppText>
        <AppText size={24} weight="800" color={theme.onPrimary}>
          {firstName}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 14, gap: 8 }}>
          <AppText size={38} weight="800" color={theme.onPrimary}>
            {orders.length}
          </AppText>
          <AppText size={14} color={theme.onPrimary} style={{ opacity: 0.85 }}>
            {t('total')}
          </AppText>
        </View>
      </Card>

      <SectionTitle>{t('summary')}</SectionTitle>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {tiles.map((x) => {
          const c = statusColors(theme, x.key);
          return (
            <Card key={x.key} style={{ flex: 1, padding: 12 }}>
              <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={x.icon} size={18} color={c.fg} />
              </View>
              <AppText size={24} weight="800" style={{ marginTop: 8 }}>
                {count(x.key)}
              </AppText>
              <AppText size={11} color={theme.sub} numberOfLines={2}>
                {x.label}
              </AppText>
            </Card>
          );
        })}
      </View>

      <SectionTitle>{t('recent')}</SectionTitle>
      {orders.slice(0, 3).map((o) => (
        <OrderCard key={o.id} order={o} onPress={() => navigation.navigate('OrderDetail', { id: o.id })} />
      ))}
      <View style={{ gap: 10, marginTop: 6 }}>
        <Button title={t('addOrder')} icon="add-circle-outline" onPress={() => navigation.navigate('NewOrder')} />
        <Button title={t('seeAll')} variant="outline" onPress={() => navigation.navigate('Orders')} />
      </View>
    </Screen>
  );
}
