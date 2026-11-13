import React from 'react';
import { TextInput, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import AppText from './AppText';

export default function Input({ label, error, style, ...rest }) {
  const { theme, scale, fontFamily } = useSettings();
  return (
    <View style={{ marginBottom: 12 }}>
      {label ? (
        <AppText size={13} weight="600" color={theme.sub} style={{ marginBottom: 6 }}>
          {label}
        </AppText>
      ) : null}
      <TextInput
        placeholderTextColor={theme.sub}
        {...rest}
        style={[
          {
            backgroundColor: theme.input,
            color: theme.text,
            borderColor: error ? theme.danger : theme.border,
            borderWidth: 1.5,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 11,
            fontSize: 15 * scale,
            fontFamily,
          },
          style,
        ]}
      />
      {error ? (
        <AppText size={12} color={theme.danger} style={{ marginTop: 4 }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
