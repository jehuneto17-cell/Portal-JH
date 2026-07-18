import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { C, space, type } from '../theme';

// Estados de tela cheia reaproveitados pelas telas autenticadas enquanto os dados
// do cliente carregam ou quando não há cliente vinculado ao usuário.

export function TelaCarregando() {
  return (
    <View style={styles.centro}>
      <ActivityIndicator color={C.primary} />
    </View>
  );
}

export function TelaMensagem({ texto }) {
  return (
    <View style={styles.centro}>
      <Text style={[type.body, styles.texto]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xxl,
  },
  texto: {
    color: C.textMuted,
    textAlign: 'center',
  },
});
