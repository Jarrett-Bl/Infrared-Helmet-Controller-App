import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';



export default function NewStartScreen() {
  
  const handleUserMode = () => {
    console.log('User mode selected');
    // Navigate to main app (tabs)
    router.push('/(tabs)/homeScreen');
  };

  const handleAdminMode = () => {
    console.log('Admin mode selected');
    // Navigate to admin interface or settings
    router.push('/(tabs)/pinPage');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome User</Text>
        <Text style={styles.subtitle}>Select Mode</Text>
      </View>

      {/* Mode Selection Cards */}
      <View style={styles.cardContainer}>
        
        {/* User Mode Card */}
        <TouchableOpacity 
          style={styles.modeCard}
          onPress={handleUserMode}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="person" size={60} color="#2196F3" />
          </View>
          <Text style={styles.modeTitle}>User Mode</Text>
          <Text style={styles.modeDescription}>
            Enter User Mode
          </Text>
        </TouchableOpacity>

        {/* Admin Mode Card */}
        <TouchableOpacity 
          style={styles.modeCard}
          onPress={handleAdminMode}
          activeOpacity={0.4}
        >
          <Text style={styles.modeTitle}>Admin Login</Text>
          <Text style={styles.modeDescription}>
            Advanced settings, device management, and system configuration
          </Text>
        </TouchableOpacity>
        
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8B949E',
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
    gap: 20,
  },
  modeCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconContainer: {
    marginBottom: 1,
  },
  modeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  modeDescription: {
    fontSize: 16,
    color: '#8B949E',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  featureList: {
    alignItems: 'flex-start',
  },
  featureItem: {
    fontSize: 14,
    color: '#FFFFFF',
    marginVertical: 2,
  },
  footer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#8B949E',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});