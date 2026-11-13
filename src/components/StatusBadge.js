import React from 'react';
import { View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import AppText from './AppText';

const LABELS = { inProgress: 'statusInProgress', waiting: 'statusWaiting', ready: 'statusReady' };

export function statusColors(theme, status) {
  if (status === 'ready') return { fg: theme.success, bg: theme.successSoft };
  if (status === 'waiting') return { fg: theme.warning, bg: theme.warningSoft };
  return { fg: theme.info, bg: theme.infoSoft };
}

export default function StatusBadge({ status }) {
  const { theme, t } = useSettings();
  const c = statusColors(theme, status);
  return (
    <View style={{ backgroundColor: c.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
      <AppText size={12} weight="700" color={c.fg}>
        {t(LABELS[status])}
      </AppText>
    </View>
  );
}
