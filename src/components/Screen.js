import React from 'react';
import { ScrollView } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function Screen({ children, contentStyle, ...rest }) {
  const { theme } = useSettings();
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      {...rest}
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={[{ padding: 16, paddingBottom: 32 }, contentStyle]}
    >
      {children}
    </ScrollView>
  );
}
