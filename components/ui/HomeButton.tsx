import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface HomeButtonProps {
  title?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: number; 
  color?: string;
  onPress?: () => void;
 iconName?: keyof typeof MaterialIcons.glyphMap;
}

export default function HomeButton({ 
  style, 
  onPress,
  iconName = 'home', 
  size = 40,
  color = '#FFFFFF',
}: HomeButtonProps) {
  
  const handlePress = () => {
    // Custom onPress logic if provided
    if (onPress) {
      onPress();
    }
    
    // Navigate to home page
    router.push('/homeScreen');
    // Or if you want to replace the current screen: router.replace('/');
  };

  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <MaterialIcons name={iconName} size={size} color={color}/>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 30,
    right: 20,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 5, // For Android shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4, 
}

});