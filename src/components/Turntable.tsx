import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Easing, StyleSheet } from 'react-native';

interface TurntableProps {
  isPlaying: boolean;
  coverUrl: string;
  isDarkTheme?: boolean;
}

export const Turntable: React.FC<TurntableProps> = ({ isPlaying, coverUrl, isDarkTheme = false }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const spinAnimation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isPlaying) {
      // Start loop rotation
      spinAnimation.current = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 12000, // 12 seconds per rotation (5 RPM) for an elegant, calm feel
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spinAnimation.current.start();
    } else {
      // Pause animation
      if (spinAnimation.current) {
        spinAnimation.current.stop();
      }
    }

    return () => {
      if (spinAnimation.current) {
        spinAnimation.current.stop();
      }
    };
  }, [isPlaying]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const platterBg = isDarkTheme ? '#1A1A1A' : '#E8E4DD';
  const platterBorder = isDarkTheme ? '#2A2A2A' : '#D8D4CD';

  return (
    <View className="items-center justify-center my-6">
      {/* Outer physical turntable housing ring */}
      <View 
        className="w-72 h-72 rounded-full items-center justify-center"
        style={[
          styles.outerPlatter,
          { 
            backgroundColor: platterBg, 
            borderColor: platterBorder,
            shadowColor: isDarkTheme ? '#000' : '#A39E96',
          }
        ]}
      >
        {/* Inner rotating platter platter */}
        <Animated.View
          style={[
            styles.spinningPlatter,
            {
              transform: [{ rotate: spin }],
              borderColor: isDarkTheme ? '#333333' : '#FFFFFF',
            }
          ]}
        >
          {/* Centered circular album art */}
          <View className="w-56 h-56 rounded-full overflow-hidden border border-[#1D1D1D]/10">
            <Image 
              source={{ uri: coverUrl || 'https://via.placeholder.com/200' }} 
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Turntable spindle center pin (Braun hardware detail) */}
          <View className="w-4 h-4 rounded-full bg-[#E8E4DD] absolute border border-[#D8D4CD] justify-center items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-[#1D1D1D]" />
          </View>

          {/* Tactile indicator dot on the platter rim */}
          <View 
            className="w-2.5 h-2.5 rounded-full absolute top-3 bg-white border border-[#D8D4CD]"
            style={styles.rimDot}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerPlatter: {
    borderWidth: 2,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  spinningPlatter: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rimDot: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  }
});
export default Turntable;
