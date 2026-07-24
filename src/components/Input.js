import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { C, radius, space, type } from '../theme';

export default function Input({
  icon,
  style,
  secureTextEntry,
  toggleSecureEntry,
  ...props
}) {
  const [oculto, setOculto] = useState(secureTextEntry);

  // Só mostra o botão de olho quando o campo foi marcado como senha.
  const mostrarToggle = secureTextEntry && toggleSecureEntry;

  return (
    <View style={[styles.wrapper, style]}>
      {icon ? (
        <Feather
          name={icon}
          size={18}
          color={C.textMuted}
          style={styles.icon}
        />
      ) : null}
      <TextInput
        placeholderTextColor={C.textMuted}
        style={[type.body, styles.input]}
        outlineStyle="none"
        secureTextEntry={secureTextEntry ? oculto : undefined}
        {...props}
      />
      {mostrarToggle ? (
        <Pressable
          onPress={() => setOculto((atual) => !atual)}
          hitSlop={space.sm}
          style={styles.toggle}
        >
          <Feather
            name={oculto ? 'eye' : 'eye-off'}
            size={18}
            color={C.textMuted}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: space.lg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: radius.md,
    backgroundColor: C.bg,
  },
  icon: {
    marginRight: space.md,
  },
  input: {
    flex: 1,
    height: '100%',
    color: C.text,
    outlineStyle: 'none',
  },
  toggle: {
    marginLeft: space.md,
  },
});
