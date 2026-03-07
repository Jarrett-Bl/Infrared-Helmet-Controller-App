import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { styles } from "../styles/sharedStyles";

const buttonStyles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

const BackButton = ({ style, size = 28, color = 'lightblue'}: { style?: ViewStyle; size?: number; color?: string }) => {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.back()} style={[styles.button, style]}> 
        <Ionicons name="arrow-back" size={size} color={color} />
      <Text style={buttonStyles.button}>&larr; Back</Text>
    </Pressable>
  );
};

export default BackButton;