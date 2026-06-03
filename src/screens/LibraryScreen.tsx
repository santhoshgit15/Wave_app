import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Heart, Disc, List, ChevronRight } from 'lucide-react-native';
import { Track } from '../services/supabaseClient';

interface LibraryScreenProps {
  likedSongsCount: number;
  tracks: Track[];
  onSelectTrack: (track: Track) => void;
  isDarkTheme?: boolean;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  likedSongsCount,
  tracks,
  onSelectTrack,
  isDarkTheme = false
}) => {
  const bgStyle = isDarkTheme ? 'bg-[#111111]' : 'bg-[#F4F1EA]';
  const surfaceStyle = isDarkTheme ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-[#E8E4DD] border-[#D8D4CD]';
  const textMain = isDarkTheme ? 'text-[#EAEAEA]' : 'text-[#1D1D1D]';
  const textMuted = isDarkTheme ? 'text-[#9A9893]' : 'text-[#706E6A]';
  const borderBottom = isDarkTheme ? 'border-b border-[#2A2A2A]' : 'border-b border-[#D8D4CD]/50';

  const categories = [
    { name: 'Liked Songs', count: `${likedSongsCount} songs`, icon: Heart },
    { name: 'Albums', count: '64 albums', icon: Disc },
    { name: 'Playlists', count: '13 playlists', icon: List },
  ];

  return (
    <View className={`flex-1 ${bgStyle} pt-12 px-5`}>
      {/* Header */}
      <View className="mb-8">
        <Text className={`text-xl font-bold tracking-[6px] ${textMain}`}>LIBRARY</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Category List */}
        <View className="mb-8">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <TouchableOpacity
                key={idx}
                className={`flex-row items-center justify-between py-5 ${borderBottom}`}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center">
                  <View 
                    className={`w-12 h-12 rounded-2xl items-center justify-center border ${surfaceStyle}`}
                  >
                    <IconComponent size={20} color={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} />
                  </View>
                  <View className="ml-4">
                    <Text className={`text-sm font-bold ${textMain}`}>{cat.name}</Text>
                    <Text className={`text-[10px] mt-0.5 ${textMuted}`}>{cat.count}</Text>
                  </View>
                </View>
                <ChevronRight size={16} color={isDarkTheme ? '#706E6A' : '#9A9893'} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* List of Recent Likes */}
        <View className="mb-12">
          <Text className={`text-[10px] font-bold tracking-widest uppercase mb-4 ${textMuted}`}>
            Recently Liked
          </Text>
          {tracks.slice(0, 4).map(track => (
            <TouchableOpacity
              key={track.id}
              onPress={() => onSelectTrack(track)}
              className="flex-row items-center justify-between py-3"
              activeOpacity={0.8}
            >
              <View className="flex-1">
                <Text className={`text-xs font-semibold ${textMain}`}>{track.title}</Text>
                <Text className={`text-[10px] mt-0.5 ${textMuted}`}>{track.artist} • {track.album}</Text>
              </View>
              <Heart size={12} color={isDarkTheme ? '#FF5D45' : '#D84B36'} fill={isDarkTheme ? '#FF5D45' : '#D84B36'} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default LibraryScreen;
