import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrdersContext';
import Chip from '../components/Chip';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import OrderCard from '../components/OrderCard';

export default function OrdersScreen({ navigation }) {
  const { theme, t } = useSettings();
  const { orders } = useOrders();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filters = [
    { value: 'all', label: t('all') },
    { value: 'inProgress', label: t('statusInProgress') },
    { value: 'waiting', label: t('statusWaiting') },
    { value: 'ready', label: t('statusReady') },
  ];

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false;
      if (!q) return true;
      return (o.device + ' ' + o.service + ' ' + o.client + ' ' + o.id).toLowerCase().includes(q);
    });
  }, [orders, query, filter]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
        <View>
          <Input placeholder={t('search')} value={query} onChangeText={setQuery} style={{ paddingLeft: 40 }} />
          <Ionicons name="search" size={18} color={theme.sub} style={{ position: 'absolute', left: 13, top: 13 }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {filters.map((f) => (
            <Chip key={f.value} label={f.label} active={filter === f.value} onPress={() => setFilter(f.value)} />
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListEmptyComponent={<EmptyState text={t('noOrders')} />}
        renderItem={({ item }) => (
          <OrderCard order={item} onPress={() => navigation.navigate('OrderDetail', { id: item.id })} />
        )}
      />
    </View>
  );
}
