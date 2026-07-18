import { Feather } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';

import { C, radius, space, type } from '../theme';

export default function Input({ icon, style, ...props }) {
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
        {...props}
      />
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
});
