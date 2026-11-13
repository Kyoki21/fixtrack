import React from 'react';
import { Text } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function AppText({ size = 15, weight, color, style, children, ...rest }) {
  const { theme, scale, fontFamily } = useSettings();
  return (
    <Text
      {...rest}
      style={[
        { color: color || theme.text, fontSize: size * scale, fontWeight: weight, fontFamily },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
