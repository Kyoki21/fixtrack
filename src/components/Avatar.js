import React from 'react';
import { Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';

export default function Avatar({ size = 36 }) {
  const { theme, settings } = useSettings();
  const common = { width: size, height: size, borderRadius: size / 2 };
  if (settings.avatarUri) {
    return <Image source={{ uri: settings.avatarUri }} style={[common, { backgroundColor: theme.border }]} />;
  }
  return (
    <View style={[common, { backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center' }]}>
      <Ionicons name="person" size={size * 0.55} color={theme.primary} />
    </View>
  );
}
