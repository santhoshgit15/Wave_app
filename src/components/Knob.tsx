import React, { useRef, useState } from 'react';
import { View, Text, PanResponder, Animated, StyleSheet } from 'react-native';

interface KnobProps {
  label: string;
  value: number; // 0 to 1
  onChange: (value: number) => void;
  isDarkTheme?: boolean;
}

export const Knob: React.FC<KnobProps> = ({ label, value, onChange, isDarkTheme = false }) => {
  const pan = useRef(new Animated.Value(0)).current;
  const [currentVal, setCurrentVal] = useState(value);
  
  // Track vertical dragging as the rotation gesture (more reliable on mobile screen grids)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Set drag baseline
        pan.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        // Map vertical swipe to a value change (delta-Y of -200px changes value from 0 to 1)
        const sensitivity = 200;
        const delta = -gestureState.dy / sensitivity;
        let newValue = Math.min(Math.max(currentVal + delta, 0), 1);
        onChange(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        const sensitivity = 200;
        const delta = -gestureState.dy / sensitivity;
        let newValue = Math.min(Math.max(currentVal + delta, 0), 1);
        setCurrentVal(newValue);
      },
    })
  ).current;

  // Map 0 -> 1 value to -150 to +150 degrees rotation
  const rotation = value * 300 - 150;

  // Theming variables
  const textMuted = isDarkTheme ? 'text-[#9A9893]' : 'text-[#706E6A]';
  const textMain = isDarkTheme ? 'text-[#EAEAEA]' : 'text-[#1D1D1D]';
  const knobBg = isDarkTheme ? '#222222' : '#E8E4DD';
  const knobBorder = isDarkTheme ? '#333333' : '#D8D4CD';
  const dotColor = isDarkTheme ? '#FF5D45' : '#D84B36'; // Braun red accent

  return (
    <View className="items-center mx-4">
      {/* Radial dial housing */}
      <View 
        {...panResponder.panHandlers}
        className="w-16 h-16 rounded-full items-center justify-center relative"
        style={[
          styles.knobContainer,
          { 
            backgroundColor: knobBg, 
            borderColor: knobBorder,
            shadowColor: isDarkTheme ? '#000' : '#A39E96',
          }
        ]}
      >
        {/* Visual tick marks around the knob */}
        <View className="absolute w-full h-full rounded-full border border-dashed border-[#706E6A]/20 scale-110" />

        {/* Rotating physical dial cylinder */}
        <Animated.View
          style={[
            styles.knobInner,
            {
              backgroundColor: isDarkTheme ? '#1A1A1A' : '#F4F1EA',
              borderColor: knobBorder,
              transform: [{ rotate: `${rotation}deg` }]
            }
          ]}
        >
          {/* Skeuomorphic grip indentation */}
          <View className="w-1.5 h-1.5 rounded-full bg-[#1D1D1D]/5 absolute top-1.5" />
          
          {/* Radial active line/dot marker */}
          <View 
            className="w-1 h-3 rounded-full absolute bottom-1"
            style={{ backgroundColor: dotColor }}
          />
        </Animated.View>
      </View>
      
      {/* Knob Label */}
      <Text className={`text-[10px] tracking-widest font-semibold uppercase mt-2 ${textMuted}`}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  knobContainer: {
    borderWidth: 1.5,
    borderRadius: 9999,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  knobInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  }
});
