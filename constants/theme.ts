// Colors for the app defined here.
export const AppColors = {
  //background: '#0E1418',
  background: '#000000',
  card: '#252D34',
  border: '#22303A',
  text: '#E6EDF3',
  textMuted: '#AEB7BF',
  primary: '#2196F3',
  primaryPressed: '#1a7bd4',
  button: '#2B3640',
  success: '#1CCB4B',
  selected: '#00FF00',
  statusIdle: '#E53935',
  statusPaused: '#FFC857',
  statusRunning: '#1CCB4B',
  zoneOn: '#1CCB4B',
  zoneOff: '#0D1A22',
  zoneBorder: '#1E2A33',
  zoneBorderOn: '#2E6B3D',
  zoneNumOff: '#8BA0AC',
};

const tintColorLight = '#0a7ea4';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: AppColors.text,
    background: AppColors.background,
    tint: AppColors.primary,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: AppColors.primary,
  },
};
