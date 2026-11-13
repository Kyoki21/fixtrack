import React from 'react';
import { Pressable, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function Card({ onPress, style, children }) {
  const { theme } = useSettings();
  const base = {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: theme.dark ? 0 : 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: theme.dark ? 0 : 2,
  };
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [base, { opacity: pressed ? 0.85 : 1 }, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}
