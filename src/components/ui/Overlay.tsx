import { StyleSheet, Text, View } from 'react-native';
import { palette } from '@/theme/colors';
import { Button } from './Button';

interface Props {
  title: string;
  actionLabel: string;
  onAction: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function Overlay({
  title,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: Props) {
  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>{title}</Text>
      <Button label={actionLabel} onPress={onAction} />
      {secondaryLabel && onSecondary ? (
        <Button label={secondaryLabel} variant="ghost" onPress={onSecondary} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.overlay,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: palette.text,
    marginBottom: 8,
  },
});
