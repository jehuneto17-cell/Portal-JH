import { Feather } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { C, radius, space, type } from '../theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  textColor,
  style,
}) {
  const isGhost = variant === 'ghost';
  const isDisabled = disabled || loading;
  const contentColor = textColor ?? (isGhost ? C.text : C.onPrimary);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isGhost ? styles.ghost : styles.primary,
        pressed && !isGhost && styles.primaryPressed,
        pressed && isGhost && styles.ghostPressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <View style={styles.content}>
          {icon ? (
            <Feather
              name={icon}
              size={18}
              color={contentColor}
              style={styles.icon}
            />
          ) : null}
          <Text style={[type.button, { color: contentColor }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xl,
  },
  primary: {
    backgroundColor: C.primary,
  },
  primaryPressed: {
    backgroundColor: C.primaryPressed,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: C.border,
  },
  ghostPressed: {
    backgroundColor: C.surface,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: space.sm,
  },
});
