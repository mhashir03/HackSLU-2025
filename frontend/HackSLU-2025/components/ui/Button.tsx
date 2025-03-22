import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps as RNTouchableOpacityProps,
  StyleProp as RNStyleProp,
  ViewStyle as RNViewStyle,
  TextStyle as RNTextStyle,
} from 'react-native';
import { useTheme } from '../../app/context/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

type TouchableOpacityProps = RNTouchableOpacityProps;
type StyleProp<T> = RNStyleProp<T>;
type ViewStyle = RNViewStyle;
type TextStyle = RNTextStyle;

export interface ButtonProps extends TouchableOpacityProps {
  /**
   * Button label text
   */
  label: string;
  
  /**
   * Visual style variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Size variant of the button
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Whether the button spans the full width of its container
   * @default false
   */
  isFullWidth?: boolean;
  
  /**
   * Optional icon to display before the button label
   */
  leftIcon?: React.ReactElement;
  
  /**
   * Optional icon to display after the button label
   */
  rightIcon?: React.ReactElement;
  
  /**
   * Custom style for the button container
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Custom style for the button text
   */
  textStyle?: StyleProp<TextStyle>;
  
  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Button component that follows the application's design system
 */
export const Button = ({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  containerStyle,
  textStyle,
  disabled,
  ...rest
}: ButtonProps) => {
  const { theme } = useTheme();
  
  // Create styles based on the theme and props
  const buttonStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderRadius: 8,
      opacity: disabled ? 0.6 : 1,
      alignSelf: isFullWidth ? 'stretch' : 'auto',
      paddingHorizontal: size === 'sm' ? 12 : size === 'md' ? 16 : 20,
      paddingVertical: size === 'sm' ? 8 : size === 'md' ? 12 : 16,
      backgroundColor: 
        variant === 'primary' 
          ? theme.accentColor 
          : variant === 'secondary' 
            ? theme.mutedBackground 
            : 'transparent',
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: variant === 'outline' ? theme.accentColor : undefined,
    },
    text: {
      fontSize: size === 'sm' ? 14 : size === 'md' ? 16 : 18,
      fontWeight: '600',
      color: 
        variant === 'primary' 
          ? 'white' 
          : variant === 'secondary' 
            ? theme.textColor 
            : theme.accentColor,
    },
    icon: {
      marginRight: leftIcon ? 8 : 0,
      marginLeft: rightIcon ? 8 : 0,
    },
  });

  return (
    <TouchableOpacity
      style={[buttonStyles.container, containerStyle]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? 'white' : theme.accentColor}
          style={{ marginRight: 8 }}
        />
      ) : leftIcon ? (
        <>{leftIcon}</>
      ) : null}
      
      <Text style={[buttonStyles.text, textStyle]}>
        {label}
      </Text>
      
      {rightIcon && !isLoading ? rightIcon : null}
    </TouchableOpacity>
  );
};

export default Button; 