import { StyleSheet, Text, View } from 'react-native';
import { MILESTONE_TILES } from '@/game/constants';
import type { Colors } from '@/theme/colors';
import { useThemedStyles } from '@/theme/useTheme';
import { font, layout, radius, spacing } from '@/theme/tokens';
import { useTrophyStore } from '@/store/trophy-store';

export function TrophyShelf() {
  const styles = useThemedStyles(makeStyles);
  const earned = useTrophyStore((state) => state.earned);

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>TROPHIES</Text>
      <View style={styles.row}>
        {MILESTONE_TILES.map((milestone) => {
          const unlocked = earned.includes(milestone);
          return (
            <View
              key={milestone}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`${milestone} trophy, ${unlocked ? 'unlocked' : 'locked'}`}
              style={[styles.badge, unlocked && styles.badgeUnlocked]}
            >
              <Text
                style={[styles.value, unlocked && styles.valueUnlocked]}
                numberOfLines={1}
                adjustsFontSizeToFit
                importantForAccessibility="no"
              >
                {milestone}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    wrap: {
      width: '100%',
      alignItems: 'center',
      gap: spacing.sm,
    },
    heading: {
      color: colors.textMuted,
      fontSize: font.xs,
      fontWeight: '700',
      letterSpacing: 1,
    },
    row: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    badge: {
      minWidth: layout.trophyBadgeMinWidth,
      flexGrow: 1,
      flexBasis: '28%',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.45,
    },
    badgeUnlocked: {
      borderColor: colors.gold,
      opacity: 1,
    },
    value: {
      color: colors.textMuted,
      fontSize: font.sm,
      fontWeight: '800',
    },
    valueUnlocked: {
      color: colors.gold,
    },
  });
