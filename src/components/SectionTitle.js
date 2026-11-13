import React from 'react';
import AppText from './AppText';

export default function SectionTitle({ children, style }) {
  return (
    <AppText size={17} weight="800" style={[{ marginTop: 18, marginBottom: 10 }, style]}>
      {children}
    </AppText>
  );
}
