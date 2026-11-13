import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useSettings } from '../context/SettingsContext';
import { useOrders } from '../context/OrdersContext';
import { syncOrders } from '../api/api';
import { KEYS, loadJson, saveJson } from '../storage/storage';
import { LANGUAGES } from '../i18n/translations';
import { validateProfile } from '../utils/validation';
import AppText from '../components/AppText';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Screen from '../components/Screen';
import Segmented from '../components/Segmented';
import SectionTitle from '../components/SectionTitle';

export default function ProfileScreen() {
  const { theme, t, settings, setSetting, updateProfile, resetSettings } = useSettings();
  const { orders } = useOrders();
  const [form, setForm] = useState({ name: settings.profile.name, phone: settings.profile.phone, email: settings.profile.email });
  const [errors, setErrors] = useState({});
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    loadJson(KEYS.lastSync, null).then(setLastSync);
  }, []);

  const saveAvatar = (result) => {
    if (!result.canceled && result.assets && result.assets[0].base64) {
      setSetting('avatarUri', 'data:image/jpeg;base64,' + result.assets[0].base64);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const options = { mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.4, base64: true };

  const fromCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(t('permCamera'));
      return;
    }
    saveAvatar(await ImagePicker.launchCameraAsync(options));
  };

  const fromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(t('permGallery'));
      return;
    }
    saveAvatar(await ImagePicker.launchImageLibraryAsync(options));
  };

  const chooseAvatar = () => {
    const buttons = [
      { text: t('takePhoto'), onPress: fromCamera },
      { text: t('chooseGallery'), onPress: fromGallery },
    ];
    if (settings.avatarUri) {
      buttons.push({ text: t('removePhoto'), style: 'destructive', onPress: () => setSetting('avatarUri', null) });
    }
    buttons.push({ text: t('cancel'), style: 'cancel' });
    Alert.alert(t('avatar'), undefined, buttons);
  };

  const setField = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const errText = (code) => (code ? t({ short: 'errShort', phone: 'errPhone', email: 'errEmail' }[code]) : undefined);

  const saveProfile = () => {
    const found = validateProfile(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    updateProfile({ name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim() });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(t('saved'));
  };

  const sync = async () => {
    setSyncing(true);
    try {
      await syncOrders(orders);
      const stamp = new Date().toLocaleString();
      setLastSync(stamp);
      saveJson(KEYS.lastSync, stamp);
      Alert.alert(t('syncOk'));
    } catch (e) {
      Alert.alert(t('syncFail'));
    } finally {
      setSyncing(false);
    }
  };

  const history = orders.filter((o) => o.status === 'ready');

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginBottom: 14 }}>
        <Pressable onPress={chooseAvatar}>
          <View style={{ width: 116, height: 116, borderRadius: 58, backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 3, borderColor: theme.primary }}>
            {settings.avatarUri ? (
              <Image source={{ uri: settings.avatarUri }} style={{ width: 116, height: 116 }} />
            ) : (
              <Ionicons name="camera" size={40} color={theme.primary} />
            )}
          </View>
          <View style={{ position: 'absolute', right: 0, bottom: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: theme.bg }}>
            <Ionicons name="pencil" size={16} color={theme.onPrimary} />
          </View>
        </Pressable>
        <AppText size={22} weight="800" style={{ marginTop: 12 }}>
          {settings.profile.name}
        </AppText>
        <AppText size={13} color={theme.sub}>
          {'ID: ' + settings.profile.techId + ' | ' + t('role')}
        </AppText>
      </View>

      <SectionTitle style={{ marginTop: 6 }}>{t('contacts')}</SectionTitle>
      <Card>
        <Input label={t('fullName')} value={form.name} onChangeText={setField('name')} error={errText(errors.name)} />
        <Input label={t('phone')} value={form.phone} onChangeText={setField('phone')} keyboardType="phone-pad" error={errText(errors.phone)} />
        <Input label={t('email')} value={form.email} onChangeText={setField('email')} keyboardType="email-address" autoCapitalize="none" error={errText(errors.email)} />
        <Button title={t('save')} icon="save-outline" onPress={saveProfile} />
      </Card>

      <SectionTitle>{t('workHistory')}</SectionTitle>
      {history.length === 0 ? (
        <AppText color={theme.sub}>{t('noHistory')}</AppText>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {history.map((o) => (
            <Card key={o.id} style={{ width: 210, marginRight: 10 }}>
              <AppText size={14} weight="700">
                {o.device}
              </AppText>
              <AppText size={13} color={theme.sub}>
                {o.service}
              </AppText>
              <AppText size={12} color={theme.sub} style={{ marginTop: 6 }}>
                {o.date}
              </AppText>
            </Card>
          ))}
        </ScrollView>
      )}

      <SectionTitle>{t('settings')}</SectionTitle>
      <Card style={{ gap: 14 }}>
        <View>
          <AppText size={13} weight="600" color={theme.sub} style={{ marginBottom: 8 }}>
            {t('theme')}
          </AppText>
          <Segmented
            value={settings.themeMode}
            onChange={(v) => setSetting('themeMode', v)}
            options={[
              { value: 'light', label: t('themeLight') },
              { value: 'dark', label: t('themeDark') },
              { value: 'system', label: t('themeSystem') },
            ]}
          />
        </View>
        <View>
          <AppText size={13} weight="600" color={theme.sub} style={{ marginBottom: 8 }}>
            {t('fontSize')}
          </AppText>
          <Segmented
            value={settings.fontSize}
            onChange={(v) => setSetting('fontSize', v)}
            options={[
              { value: 'small', label: t('fontSmall') },
              { value: 'medium', label: t('fontMedium') },
              { value: 'large', label: t('fontLarge') },
            ]}
          />
        </View>
        <View>
          <AppText size={13} weight="600" color={theme.sub} style={{ marginBottom: 8 }}>
            {t('fontFamily')}
          </AppText>
          <Segmented
            value={settings.fontFamily}
            onChange={(v) => setSetting('fontFamily', v)}
            options={[
              { value: 'system', label: t('fontSystem') },
              { value: 'serif', label: t('fontSerif') },
              { value: 'mono', label: t('fontMono') },
            ]}
          />
        </View>
        <View>
          <AppText size={13} weight="600" color={theme.sub} style={{ marginBottom: 8 }}>
            {t('language')}
          </AppText>
          <Segmented
            value={settings.language}
            onChange={(v) => setSetting('language', v)}
            options={LANGUAGES.map((l) => ({ value: l.code, label: l.label }))}
          />
        </View>
        <View style={{ backgroundColor: theme.input, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: theme.border }}>
          <AppText size={15}>{t('preview')}</AppText>
        </View>
        <Button title={t('reset')} variant="outline" icon="refresh" onPress={resetSettings} />
      </Card>

      <SectionTitle>{t('cloud')}</SectionTitle>
      <Card>
        <AppText size={13} color={theme.sub} style={{ marginBottom: 12 }}>
          {t('lastSync') + ': ' + (lastSync || t('never'))}
        </AppText>
        <Button title={t('syncNow')} icon="cloud-upload-outline" onPress={sync} loading={syncing} />
      </Card>
    </Screen>
  );
}
