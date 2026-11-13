import React from 'react';
import { Pressable } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import AppText from './AppText';

export default function Chip({ label, active, onPress }) {
  const { theme } = useSettings();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: active ? theme.primary : theme.card,
        borderWidth: 1,
        borderColor: active ? theme.primary : theme.border,
      }}
    >
      <AppText size={13} weight="600" color={active ? theme.onPrimary : theme.text}>
        {label}
      </AppText>
    </Pressable>
  );
}
