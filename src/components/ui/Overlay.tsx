import { Pressable, StyleSheet, Text, View } from 'react-native';
import { clearWebFocus } from '@/lib/focus';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, radius, spacing } from '@/theme/tokens';
import { Button } from './Button';

interface Props {
  title: string;
  actionLabel: string;
  onAction: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  onClose?: () => void;
}

export function Overlay({
  title,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  onClose,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.overlay}>
      {onClose ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
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
  });
