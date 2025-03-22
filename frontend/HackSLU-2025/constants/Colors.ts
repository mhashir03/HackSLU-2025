/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#4A90E2'; // Calming Blue as the primary color
const tintColorDark = '#4A90E2'; // Same blue for dark mode

export const Colors = {
  light: {
    text: '#121212', // Soft Black for text in light mode
    background: '#FFFFFF', // Pure White as requested
    tint: tintColorLight,
    icon: '#121212', // Soft Black for icons in light mode
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF', // Pure White for text in dark mode
    background: '#121212', // Soft Black as requested
    tint: tintColorDark,
    icon: '#FFFFFF', // Pure White for icons in dark mode
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
