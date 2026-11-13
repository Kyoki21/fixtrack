import React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import AppText from './AppText';

export default function Button({ title, onPress, icon, variant = 'primary', loading, disabled, style }) {
  const { theme } = useSettings();
  const filled = variant === 'primary';
  const danger = variant === 'danger';
  const bg = filled ? theme.primary : 'transparent';
  const fg = filled ? theme.onPrimary : danger ? theme.danger : theme.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingVertical: 13,
          paddingHorizontal: 18,
          borderRadius: 14,
          backgroundColor: bg,
          borderWidth: filled ? 0 : 1.5,
          borderColor: fg,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
      <AppText size={15} weight="700" color={fg}>
        {title}
      </AppText>
    </Pressable>
  );
}
