import React from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface SettingsScreenProps {
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  isDarkTheme,
  onToggleTheme
}) => {
  const bgStyle = isDarkTheme ? 'bg-[#111111]' : 'bg-[#F4F1EA]';
  const surfaceStyle = isDarkTheme ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-[#E8E4DD] border-[#D8D4CD]';
  const textMain = isDarkTheme ? 'text-[#EAEAEA]' : 'text-[#1D1D1D]';
  const textMuted = isDarkTheme ? 'text-[#9A9893]' : 'text-[#706E6A]';
  const borderBottom = isDarkTheme ? 'border-b border-[#2A2A2A]' : 'border-b border-[#D8D4CD]/50';

  return (
    <View className={`flex-1 ${bgStyle} pt-12 px-5`}>
      {/* Header */}
      <View className="mb-8">
        <Text className={`text-xl font-bold tracking-[6px] ${textMain}`}>SETTINGS</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Settings options */}
        <View className="mb-8">
          
          {/* Theme Option */}
          <View className={`flex-row items-center justify-between py-5 ${borderBottom}`}>
            <View>
              <Text className={`text-sm font-bold ${textMain}`}>Theme</Text>
              <Text className={`text-[10px] mt-0.5 ${textMuted}`}>
                {isDarkTheme ? 'Dark Mode Active' : 'Light Mode Active'}
              </Text>
            </View>
            {/* Skeuomorphic tactile toggle switch */}
            <Switch
              value={isDarkTheme}
              onValueChange={onToggleTheme}
              trackColor={{ false: '#D8D4CD', true: '#2A2A2A' }}
              thumbColor={isDarkTheme ? '#FF5D45' : '#D84B36'} // Accent orange-red
              ios_backgroundColor="#D8D4CD"
            />
          </View>

          {/* Downloads Option */}
          <TouchableOpacity 
            className={`flex-row items-center justify-between py-5 ${borderBottom}`}
            activeOpacity={0.8}
          >
            <View>
              <Text className={`text-sm font-bold ${textMain}`}>Downloads</Text>
              <Text className={`text-[10px] mt-0.5 ${textMuted}`}>24 songs offline • 182 MB</Text>
            </View>
            <ChevronRight size={16} color={isDarkTheme ? '#706E6A' : '#9A9893'} />
          </TouchableOpacity>

          {/* About Option */}
          <TouchableOpacity 
            className={`flex-row items-center justify-between py-5 ${borderBottom}`}
            activeOpacity={0.8}
          >
            <View>
              <Text className={`text-sm font-bold ${textMain}`}>About</Text>
              <Text className={`text-[10px] mt-0.5 ${textMuted}`}>WAVE Music Player v1.0.0</Text>
            </View>
            <ChevronRight size={16} color={isDarkTheme ? '#706E6A' : '#9A9893'} />
          </TouchableOpacity>

        </View>

        {/* Minimal hardware specification layout (Braun branding detail) */}
        <View className={`rounded-2xl p-5 border ${surfaceStyle} mt-4 items-center`}>
          <Text className={`text-[9px] font-bold tracking-[4px] uppercase ${textMain} mb-1.5`}>
            Braun AG Frankfurt
          </Text>
          <Text className={`text-[8px] text-center tracking-[1px] leading-3 ${textMuted}`}>
            Type: WAVE 001 • Made in Germany{"\n"}
            Designed by Antigravity under Rams principles
          </Text>
          {/* Subtle metal logo detail */}
          <View className="w-8 h-1 rounded-full bg-[#1D1D1D]/10 mt-3" />
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
