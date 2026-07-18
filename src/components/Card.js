import { StyleSheet, View } from 'react-native';

import { C, radius, space } from '../theme';

export default function Card({ variant = 'light', children, style }) {
  const isDark = variant === 'dark';

  return (
    <View style={[styles.base, isDark ? styles.dark : styles.light, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.card,
    padding: space.lg,
  },
  light: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.surfaceDark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dark: {
    backgroundColor: C.surfaceDark,
  },
});
