import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

const BackButton = () => {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <Text style={styles.text}>&larr; Back</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignSelf: 'flex-start',
    margin: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default BackButton;