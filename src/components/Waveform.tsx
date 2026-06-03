import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, GestureResponderEvent, StyleSheet } from 'react-native';

interface WaveformProps {
  progress: number; // 0 to 1
  durationMs: number;
  positionMs: number;
  onSeek: (positionMs: number) => void;
  isDarkTheme?: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({
  progress,
  durationMs,
  positionMs,
  onSeek,
  isDarkTheme = false
}) => {
  const [width, setWidth] = useState(300);

  // Pre-computed heights for 40 waveform bars to create a balanced, organic wave
  const barHeights = [
    12, 18, 10, 15, 25, 32, 14, 20, 28, 42, 
    30, 22, 15, 25, 36, 48, 38, 24, 18, 12, 
    16, 26, 32, 22, 18, 28, 40, 36, 20, 14,
    18, 24, 30, 25, 16, 22, 15, 10, 18, 12
  ];

  const handlePress = (event: GestureResponderEvent) => {
    const clickX = event.nativeEvent.locationX;
    const clickRatio = Math.min(Math.max(clickX / width, 0), 1);
    const newPosition = Math.floor(clickRatio * durationMs);
    onSeek(newPosition);
  };

  const formatTime = (ms: number) => {
    if (isNaN(ms) || ms < 0) return '0:00';
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const activeColor = isDarkTheme ? '#FF5D45' : '#D84B36'; // Braun red
  const inactiveColor = isDarkTheme ? '#333333' : '#D8D4CD';

  return (
    <View className="w-full px-6 my-4">
      {/* Waveform Scrubber container */}
      <TouchableWithoutFeedback onPress={handlePress}>
        <View 
          className="h-16 flex-row items-center justify-between"
          onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        >
          {barHeights.map((h, i) => {
            const barRatio = i / barHeights.length;
            const isActive = progress >= barRatio;
            return (
              <View
                key={i}
                style={[
                  styles.bar,
                  {
                    height: h,
                    backgroundColor: isActive ? activeColor : inactiveColor,
                  }
                ]}
              />
            );
          })}
        </View>
      </TouchableWithoutFeedback>

      {/* Time indicators */}
      <View className="flex-row justify-between mt-1">
        <Text className={`text-[11px] font-medium ${isDarkTheme ? 'text-[#9A9893]' : 'text-[#706E6A]'}`}>
          {formatTime(positionMs)}
        </Text>
        <Text className={`text-[11px] font-medium ${isDarkTheme ? 'text-[#9A9893]' : 'text-[#706E6A]'}`}>
          {formatTime(durationMs)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: 4,
    borderRadius: 2,
    marginHorizontal: 1.5,
  }
});
export default Waveform;
