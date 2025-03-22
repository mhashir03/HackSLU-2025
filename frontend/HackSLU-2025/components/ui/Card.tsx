import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../../app/context/ThemeContext';

/**
 * Card component props
 */
interface CardProps extends ViewProps {
  /**
   * Content to render inside the card
   */
  children: React.ReactNode;
  
  /**
   * Card padding amount
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /**
   * Optional background color override
   */
  backgroundColor?: string;
  
  /**
   * Whether to add a subtle shadow to the card
   * @default true
   */
  withShadow?: boolean;
}

/**
 * A card component that displays content in a contained, styled box
 */
export function Card({
  children,
  padding = 'md',
  backgroundColor,
  withShadow = true,
  style,
  ...props
}: CardProps) {
  const { theme } = useTheme();
  
  // Determine padding based on size
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return 8;
      case 'lg':
        return 24;
      case 'md':
      default:
        return 16;
    }
  };
  
  // Create styles based on the theme and props
  const styles = StyleSheet.create({
    card: {
      backgroundColor: backgroundColor || theme.cardBackground,
      borderRadius: 12,
      padding: getPadding(),
      marginVertical: 8,
      ...(withShadow && {
        shadowColor: theme.isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.3)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
      }),
    },
  });

  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

export default Card; 