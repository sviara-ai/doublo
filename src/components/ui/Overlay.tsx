import { Pressable, StyleSheet, Text, View } from 'react-native';
import { clearWebFocus } from '@/lib/focus';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, radius, spacing } from '@/theme/tokens';
import { Button } from './Button';

interface Props {
  title: string;
  message?: string;
  actionLabel: string;
  onAction: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  onClose?: () => void;
  closeLabel?: string;
}

export function Overlay({
  title,
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  onClose,
  closeLabel = 'Close',
}: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View
      accessibilityViewIsModal
      accessibilityRole="alert"
      accessibilityLabel={message ? `${title}. ${message}` : title}
      style={styles.overlay}
    >
      {onClose ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          hitSlop={12}
          onPress={() => {
            clearWebFocus();
            onClose();
          }}
          style={({ pressed }) => [styles.close, pressed && styles.closePressed]}
        >
          <Text style={styles.closeLabel}>×</Text>
        </Pressable>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Button label={actionLabel} onPress={onAction} />
      {secondaryLabel && onSecondary ? (
        <Button label={secondaryLabel} variant="ghost" onPress={onSecondary} />
      ) : null}
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    close: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      width: 36,
      height: 36,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.hairline,
    },
    closePressed: {
      backgroundColor: colors.boardCell,
    },
    closeLabel: {
      color: colors.text,
      fontSize: font.lg,
      fontWeight: '800',
      lineHeight: font.lg + 2,
    },
    title: {
      fontSize: font.xl,
      fontWeight: '800',
      color: colors.text,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    message: {
      fontSize: font.md,
      color: colors.textMuted,
      textAlign: 'center',
      maxWidth: layout.maxProseWidth,
      marginBottom: spacing.sm,
    },
  });
