import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, SafeAreaView, StyleSheet } from 'react-native';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart } from 'lucide-react-native';
import { Track } from '../services/supabaseClient';
import { Turntable } from '../components/Turntable';
import { Waveform } from '../components/Waveform';
import { Knob } from '../components/Knob';

interface PlayerModalProps {
  isVisible: boolean;
  onClose: () => void;
  track: Track | null;
  isPlaying: boolean;
  positionMs: number;
  durationMs: number;
  progress: number;
  onTogglePlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onSeek: (positionMs: number) => void;
  isDarkTheme?: boolean;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  isVisible,
  onClose,
  track,
  isPlaying,
  positionMs,
  durationMs,
  progress,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onSeek,
  isDarkTheme = false
}) => {
  const [volume, setVolume] = useState(0.8);
  const [bass, setBass] = useState(0.5);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  if (!track) return null;

  // Theming definitions
  const bgStyle = isDarkTheme ? 'bg-[#111111]' : 'bg-[#F4F1EA]';
  const textMain = isDarkTheme ? 'text-[#EAEAEA]' : 'text-[#1D1D1D]';
  const textMuted = isDarkTheme ? 'text-[#9A9893]' : 'text-[#706E6A]';
  const buttonBg = isDarkTheme ? '#1A1A1A' : '#E8E4DD';
  const buttonBorder = isDarkTheme ? '#2A2A2A' : '#D8D4CD';
  const activeColor = isDarkTheme ? '#FF5D45' : '#D84B36'; // Braun red accent

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    // Bind to sound output volume if hooked up in parent container
  };

  const handleBassChange = (newBass: number) => {
    setBass(newBass);
    // Bind to equalizer filter low-shelf gain if hooked up
  };

  const handleProgressChange = (newProg: number) => {
    const newPosition = Math.floor(newProg * durationMs);
    onSeek(newPosition);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView className={`flex-1 ${bgStyle}`}>
        <View className="flex-1 justify-between py-6">
          
          {/* Header section */}
          <View className="px-6 flex-row justify-between items-center">
            <TouchableOpacity onPress={onClose} className="p-2 -ml-2">
              <ChevronDown size={22} color={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} />
            </TouchableOpacity>
            
            <View className="items-center">
              <Text className={`text-xs font-bold tracking-[4px] truncate max-w-[200px] uppercase ${textMain}`}>
                {track.title}
              </Text>
              <Text className={`text-[10px] mt-0.5 font-medium truncate max-w-[200px] ${textMuted}`}>
                {track.artist}
              </Text>
            </View>
            
            {/* Minimal spacing placeholder */}
            <View className="w-8 h-8" />
          </View>

          {/* Turntable Platter dial section */}
          <View className="items-center justify-center flex-1 my-2">
            <Turntable 
              isPlaying={isPlaying} 
              coverUrl={track.cover_url} 
              isDarkTheme={isDarkTheme} 
            />
          </View>

          {/* Waveform visualizer progress section */}
          <Waveform 
            progress={progress}
            durationMs={durationMs}
            positionMs={positionMs}
            onSeek={onSeek}
            isDarkTheme={isDarkTheme}
          />

          {/* Controls Deck */}
          <View className="items-center justify-center my-4">
            
            {/* Tactile Media Buttons Row */}
            <View className="flex-row items-center justify-between w-[80%] mb-8">
              
              {/* Like / Favorite Switch */}
              <TouchableOpacity 
                onPress={() => setIsLiked(!isLiked)}
                className="w-10 h-10 items-center justify-center rounded-full"
              >
                <Heart 
                  size={18} 
                  color={isLiked ? activeColor : (isDarkTheme ? '#706E6A' : '#9A9893')} 
                  fill={isLiked ? activeColor : 'none'} 
                />
              </TouchableOpacity>

              {/* Prev Button */}
              <TouchableOpacity 
                onPress={onPrevTrack}
                className="w-12 h-12 rounded-full items-center justify-center border shadow-sm"
                style={[styles.tactileBtn, { backgroundColor: buttonBg, borderColor: buttonBorder }]}
              >
                <SkipBack size={18} color={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} fill={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} />
              </TouchableOpacity>

              {/* Central Play/Pause Plunger */}
              <TouchableOpacity 
                onPress={onTogglePlay}
                className="w-16 h-16 rounded-full items-center justify-center border shadow-md"
                style={[
                  styles.tactileBtn, 
                  styles.playBtn, 
                  { 
                    backgroundColor: isDarkTheme ? '#1A1A1A' : '#F4F1EA', 
                    borderColor: buttonBorder,
                    shadowColor: isDarkTheme ? '#000' : '#A39E96'
                  }
                ]}
              >
                {isPlaying ? (
                  <Pause size={22} color={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} fill={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} />
                ) : (
                  <Play size={22} color={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} fill={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} />
                )}
              </TouchableOpacity>

              {/* Next Button */}
              <TouchableOpacity 
                onPress={onNextTrack}
                className="w-12 h-12 rounded-full items-center justify-center border shadow-sm"
                style={[styles.tactileBtn, { backgroundColor: buttonBg, borderColor: buttonBorder }]}
              >
                <SkipForward size={18} color={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} fill={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} />
              </TouchableOpacity>

              {/* Shuffle Switch */}
              <TouchableOpacity 
                onPress={() => setIsShuffle(!isShuffle)}
                className="w-10 h-10 items-center justify-center rounded-full"
              >
                <Shuffle 
                  size={16} 
                  color={isShuffle ? activeColor : (isDarkTheme ? '#706E6A' : '#9A9893')} 
                />
              </TouchableOpacity>
            </View>

            {/* Custom Skeuomorphic Rotary Knobs Row */}
            <View className="flex-row items-center justify-between w-[90%] px-4">
              <Knob 
                label="Volume" 
                value={volume} 
                onChange={handleVolumeChange} 
                isDarkTheme={isDarkTheme} 
              />
              <Knob 
                label="Progress" 
                value={progress} 
                onChange={handleProgressChange} 
                isDarkTheme={isDarkTheme} 
              />
              <Knob 
                label="Bass" 
                value={bass} 
                onChange={handleBassChange} 
                isDarkTheme={isDarkTheme} 
              />
            </View>
          </View>

        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  tactileBtn: {
    borderWidth: 1.2,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  playBtn: {
    borderWidth: 1.5,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  }
});
export default PlayerModal;
