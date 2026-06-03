import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
  isDarkTheme?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, isDarkTheme = false }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto transition to main dashboard after 2.5 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(onFinish);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const bgStyle = {
    backgroundColor: isDarkTheme ? '#111111' : '#F4F1EA',
  };

  const textStyle = {
    color: isDarkTheme ? '#EAEAEA' : '#1D1D1D',
  };

  const accentBorder = {
    borderColor: isDarkTheme ? '#2A2A2A' : '#D8D4CD',
    backgroundColor: isDarkTheme ? '#1A1A1A' : '#E8E4DD',
  };

  return (
    <Animated.View 
      style={[styles.container, bgStyle, { opacity: fadeAnim }]}
    >
      <Animated.View 
        style={[styles.content, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Minimal hardware-inspired circle (Braun/Dieter Rams icon) */}
        <View 
          style={[styles.circleIcon, accentBorder]}
          className="w-20 h-20 rounded-full justify-center items-center mb-6"
        >
          {/* Centered dial dot */}
          <View 
            className="w-8 h-8 rounded-full border border-dashed justify-center items-center"
            style={{ borderColor: isDarkTheme ? '#333333' : '#FFFFFF' }}
          >
            <View 
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: isDarkTheme ? '#FF5D45' : '#D84B36' }}
            />
          </View>
        </View>

        {/* Minimal Logo */}
        <Text 
          className="text-2xl font-bold tracking-[8px]" 
          style={[textStyle, styles.logoText]}
        >
          WAVE
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIcon: {
    borderWidth: 2,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  logoText: {
    marginLeft: 8, // Offset the trailing letter spacing to center correctly
  }
});
export default SplashScreen;
