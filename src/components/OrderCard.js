import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import AppText from './AppText';
import Card from './Card';
import StatusBadge from './StatusBadge';

export default function OrderCard({ order, onPress }) {
  const { theme } = useSettings();
  return (
    <Card onPress={onPress} style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText size={16} weight="700" style={{ flex: 1, marginRight: 8 }}>
          {'#' + order.id + ' · ' + order.device}
        </AppText>
        <StatusBadge status={order.status} />
      </View>
      <AppText size={14} color={theme.sub} style={{ marginTop: 4 }}>
        {order.service}
      </AppText>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="person-outline" size={15} color={theme.sub} />
          <AppText size={13} color={theme.sub}>
            {order.client}
          </AppText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="calendar-outline" size={15} color={theme.sub} />
          <AppText size={13} color={theme.sub}>
            {order.date}
          </AppText>
        </View>
      </View>
    </Card>
  );
}
