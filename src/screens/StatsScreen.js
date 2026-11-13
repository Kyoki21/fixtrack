import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { STATUSES, useOrders } from '../context/OrdersContext';
import AppText from '../components/AppText';
import Card from '../components/Card';
import Screen from '../components/Screen';
import SectionTitle from '../components/SectionTitle';
import { statusColors } from '../components/StatusBadge';

const LABELS = { inProgress: 'statusInProgress', waiting: 'statusWaiting', ready: 'statusReady' };

function Bar({ label, value, total, color }) {
  const { theme, t } = useSettings();
  const pct = total ? (value / total) * 100 : 0;
  return (
    <View style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <AppText size={14} weight="600">
          {label}
        </AppText>
        <AppText size={14} color={theme.sub}>
          {value + ' ' + t('pcs') + ' · ' + Math.round(pct) + '%'}
        </AppText>
      </View>
      <View style={{ height: 10, borderRadius: 5, backgroundColor: theme.border, overflow: 'hidden' }}>
        <View style={{ height: 10, width: pct + '%', backgroundColor: color, borderRadius: 5 }} />
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const { theme, t } = useSettings();
  const { orders } = useOrders();

  const devices = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      map[o.device] = (map[o.device] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [orders]);

  return (
    <Screen>
      <Card>
        <AppText size={13} color={theme.sub}>
          {t('total')}
        </AppText>
        <AppText size={40} weight="800" color={theme.primary}>
          {orders.length}
        </AppText>
      </Card>
      <SectionTitle>{t('byStatus')}</SectionTitle>
      <Card>
        {STATUSES.map((s) => (
          <Bar key={s} label={t(LABELS[s])} value={orders.filter((o) => o.status === s).length} total={orders.length} color={statusColors(theme, s).fg} />
        ))}
      </Card>
      <SectionTitle>{t('byDevice')}</SectionTitle>
      <Card>
        {devices.map(([name, n]) => (
          <Bar key={name} label={name} value={n} total={orders.length} color={theme.primary} />
        ))}
      </Card>
    </Screen>
  );
}
