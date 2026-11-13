import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import AppText from './AppText';

export default function EmptyState({ icon = 'file-tray-outline', text }) {
  const { theme } = useSettings();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
      <Ionicons name={icon} size={44} color={theme.sub} />
      <AppText color={theme.sub} style={{ marginTop: 10, textAlign: 'center' }}>
        {text}
      </AppText>
    </View>
  );
}
