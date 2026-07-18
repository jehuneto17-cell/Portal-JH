import { StyleSheet, Text, View } from 'react-native';

import { C, radius, space, type } from '../theme';

const STATUS = {
  // faturas
  pago: { bg: C.successBg, color: C.successText, label: 'Pago' },
  pendente: { bg: C.warningBg, color: C.warningText, label: 'Pendente' },
  atrasado: { bg: C.dangerBg, color: C.dangerText, label: 'Atrasado' },
  pausado: { bg: C.pausedBg, color: C.pausedText, label: 'Pausado' },
  // produtos
  ativo: { bg: C.successBg, color: C.successText, label: 'Ativo' },
  dev: { bg: C.warningBg, color: C.warningText, label: 'Em dev' },
};

export default function StatusBadge({ status, style }) {
  const config = STATUS[status] ?? STATUS.pausado;

  return (
    <View style={[styles.pill, { backgroundColor: config.bg }, style]}>
      <Text style={[type.badge, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingVertical: space.xs,
    paddingHorizontal: space.md,
  },
});
