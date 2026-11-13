import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import { fetchClients } from '../api/api';
import { KEYS, loadJson, saveJson } from '../storage/storage';
import AppText from '../components/AppText';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';

export default function ClientsScreen({ navigation }) {
  const { theme, t } = useSettings();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [query, setQuery] = useState('');

  const load = useCallback(async (isRefresh) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await fetchClients();
      setClients(data);
      setError(false);
      setFromCache(false);
      saveJson(KEYS.clients, data);
    } catch (e) {
      const cached = await loadJson(KEYS.clients, []);
      setClients(cached);
      setFromCache(cached.length > 0);
      setError(cached.length === 0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? clients.filter((c) => (c.name + c.email + c.city).toLowerCase().includes(q)) : clients;
  }, [clients, query]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <AppText color={theme.sub} style={{ marginTop: 12 }}>
          {t('loading')}
        </AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg, padding: 24 }}>
        <EmptyState icon="cloud-offline-outline" text={t('loadError')} />
        <Button title={t('retry')} icon="refresh" onPress={() => load(false)} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
        <Input placeholder={t('clientsSearch')} value={query} onChangeText={setQuery} />
        {fromCache ? (
          <AppText size={12} color={theme.warning} style={{ marginBottom: 8 }}>
            {t('offlineCache')}
          </AppText>
        ) : null}
      </View>
      <FlatList
        data={data}
        keyExtractor={(c) => String(c.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.primary} />}
        ListEmptyComponent={<EmptyState text={t('noOrders')} />}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
                <AppText size={17} weight="800" color={theme.primary}>
                  {item.name.charAt(0)}
                </AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText size={16} weight="700">
                  {item.name}
                </AppText>
                <AppText size={13} color={theme.sub}>
                  {item.phone}
                </AppText>
                <AppText size={13} color={theme.sub}>
                  {item.email}
                </AppText>
              </View>
              <Ionicons name="add-circle" size={30} color={theme.primary} onPress={() => navigation.navigate('NewOrder', { client: item })} />
            </View>
          </Card>
        )}
      />
    </View>
  );
}
