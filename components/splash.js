import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  loadingText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

});

export default function Splash() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  const [dots, setDots] = useState('...');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(dots => dots === '...' ? '.' : dots + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient
      colors={['#5E239D', '#F6AE2D', '#1B1B1B']}
      useAngle={true}
      angle={45} // change this value to control the angle of the gradient
      style={styles.container}
    >
      <StatusBar translucent={true} backgroundColor="transparent" />
      {isLoading ? (
        <Text style={styles.loadingText}>Loading{dots}</Text>
      ) : null}
    </LinearGradient>
  );
}
