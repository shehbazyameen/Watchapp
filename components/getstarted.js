import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';

function Getstarted() {
  const navigation = useNavigation();
  const [hasLoggedInBefore, setHasLoggedInBefore] = useState(false);

  useEffect(() => {
    // check if user has logged in before, and navigate to dashboard if they have
    if (hasLoggedInBefore) {
      navigation.dispatch(StackActions.replace('Dashboard'));
    }
  }, [hasLoggedInBefore, navigation]);

  const handleGetStartedPress = () => {
    setHasLoggedInBefore(true);
    navigation.dispatch(StackActions.replace('Dashboard'));
  };

  return (
    <ImageBackground
      source={require('../Welcome-Design.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.text}>Face Watch - Selfie Messaging Made Easy!</Text>
        <Text style={styles.paragraph}>Take a selfie and message other users with fun features like stickers, filters, and emojis in seconds with our private and secure Face Watch app!</Text>
        <TouchableOpacity style={styles.button} onPress={handleGetStartedPress}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  text: {
    color: '#1B1B1B',
    fontSize: 28,
    textAlign: 'center',
  },

  paragraph: {
    color: '#1B1B1B',
    textAlign: 'center',
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

  button: {
    alignSelf: 'center',
    marginBottom: 50,
    backgroundColor: '#5E239D',
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});

export default Getstarted;
