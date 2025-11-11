import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';



const ADMIN_PIN = '1234'; // You can change this or make it configurable

export default function PinEntryScreen() {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNumberPress = (number: string) => {
    if (pin.length < 4) {
      setPin(pin + number);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) {
      Alert.alert('Error', 'Please enter a 4-digit PIN');
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (pin === ADMIN_PIN) {
        console.log('✅ Admin PIN correct');
        router.push('/protocolRunPage');
      } else {
        console.log('❌ Admin PIN incorrect');
        Alert.alert('Access Denied', 'Incorrect PIN. Please try again.');
        setPin(''); // Clear PIN on failure
      }
      setIsLoading(false);
    }, 500);
  };

  const handleCancel = () => {
    router.back(); // Go back to previous screen
  };

  const renderPinDots = () => {
    return (
      <View style={styles.pinDotsContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              index < pin.length && styles.pinDotFilled
            ]}
          />
        ))}
      </View>
    );
  };

  const renderNumberPad = () => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'backspace']
    ];

    return (
      <View style={styles.numberPad}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numberRow}>
            {row.map((item, itemIndex) => {
              if (item === '') {
                return <View key={itemIndex} style={styles.numberButton} />;
              }
              
              if (item === 'backspace') {
                return (
                  <TouchableOpacity
                    key={itemIndex}
                    style={styles.numberButton}
                    onPress={handleBackspace}
                    disabled={pin.length === 0}
                  >
                    <MaterialIcons 
                      name="backspace" 
                      size={24} 
                      color={pin.length === 0 ? '#444' : '#FFFFFF'} 
                    />
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.numberButton}
                  onPress={() => handleNumberPress(item)}
                  disabled={pin.length >= 4}
                >
                  <Text style={styles.numberText}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <MaterialIcons name="close" size={24} color="#8B949E" />
        </TouchableOpacity>
        <Text style={styles.title}>Admin Access</Text>
        <View style={styles.placeholder} />
      </View>

      {/* PIN Display */}
      <View style={styles.pinSection}>
        <Text style={styles.instruction}>Enter 4-digit PIN</Text>
        {renderPinDots()}
      </View>

      {/* Number Pad */}
      {renderNumberPad()}

      {/* Submit Button */}
      <View style={styles.submitSection}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            pin.length === 4 && styles.submitButtonActive,
            isLoading && styles.submitButtonLoading
          ]}
          onPress={handleSubmit}
          disabled={pin.length !== 4 || isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Verifying...' : 'Enter'}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  cancelButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  pinSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  instruction: {
    fontSize: 18,
    color: '#8B949E',
    marginBottom: 30,
  },
  pinDotsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333333',
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  numberPad: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  numberButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  numberText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  submitSection: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  submitButton: {
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonActive: {
    backgroundColor: '#00FF00',
  },
  submitButtonLoading: {
    backgroundColor: '#666666',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});