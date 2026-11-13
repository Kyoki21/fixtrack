import React from 'react';
import { Pressable, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import AppText from './AppText';

export default function Segmented({ options, value, onChange }) {
  const { theme } = useSettings();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.input,
        borderRadius: 12,
        padding: 3,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 9,
              borderRadius: 10,
              backgroundColor: active ? theme.primary : 'transparent',
            }}
          >
            <AppText size={13} weight="700" color={active ? theme.onPrimary : theme.sub}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
