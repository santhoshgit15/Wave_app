import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { Play, Pause, SkipForward, Search } from 'lucide-react-native';
import { Track } from '../services/supabaseClient';

interface HomeScreenProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onOpenPlayer: () => void;
  onOpenSearch: () => void;
  isDarkTheme?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
  onNextTrack,
  onOpenPlayer,
  onOpenSearch,
  isDarkTheme = false
}) => {
  // Split mock data into categories matching the user request
  const recentlyPlayed = tracks.slice(0, 3);
  const albums = tracks.slice(3, 7);
  
  const bgStyle = isDarkTheme ? 'bg-[#111111]' : 'bg-[#F4F1EA]';
  const surfaceStyle = isDarkTheme ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-[#E8E4DD] border-[#D8D4CD]';
  const textMain = isDarkTheme ? 'text-[#EAEAEA]' : 'text-[#1D1D1D]';
  const textMuted = isDarkTheme ? 'text-[#9A9893]' : 'text-[#706E6A]';
  const accentColor = isDarkTheme ? '#FF5D45' : '#D84B36';

  return (
    <View className={`flex-1 ${bgStyle} pt-12 relative`}>
      {/* Scrollable Dashboard */}
      <ScrollView 
        className="flex-1 px-5" 
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className={`text-xl font-bold tracking-[6px] ${textMain}`}>WAVE</Text>
          <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
        </View>

        {/* Minimal Search Bar Trigger */}
        <TouchableOpacity 
          onPress={onOpenSearch}
          className={`flex-row items-center h-11 px-4 rounded-xl border ${surfaceStyle} mb-8`}
          activeOpacity={0.8}
        >
          <Search size={16} color={isDarkTheme ? '#9A9893' : '#706E6A'} />
          <Text className={`text-sm ml-3 ${textMuted}`}>Search songs, artists, albums</Text>
        </TouchableOpacity>

        {/* Section: Recently Played */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-[11px] font-bold tracking-widest uppercase ${textMuted}`}>Recently Played</Text>
            <Text className={`text-[10px] font-semibold ${textMuted}`}>See all</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="-mx-5 px-5"
          >
            {recentlyPlayed.map((track) => (
              <TouchableOpacity 
                key={track.id}
                onPress={() => onSelectTrack(track)}
                className="mr-5 w-28"
                activeOpacity={0.8}
              >
                <View className="w-28 h-28 rounded-2xl overflow-hidden relative mb-2 shadow-sm border border-[#1D1D1D]/5">
                  <Image source={{ uri: track.cover_url }} className="w-full h-full" />
                  {/* Subtle hover-play mechanical icon */}
                  <View className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 items-center justify-center">
                    <Play size={10} color="#1D1D1D" fill="#1D1D1D" />
                  </View>
                </View>
                <Text className={`text-xs font-semibold truncate ${textMain}`}>{track.title}</Text>
                <Text className={`text-[10px] truncate ${textMuted}`}>{track.artist}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section: Albums Grid */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-[11px] font-bold tracking-widest uppercase ${textMuted}`}>Albums</Text>
            <Text className={`text-[10px] font-semibold ${textMuted}`}>See all</Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {albums.map((track) => (
              <TouchableOpacity 
                key={track.id}
                onPress={() => onSelectTrack(track)}
                className="w-[47%] mb-5"
                activeOpacity={0.8}
              >
                <View className="w-full aspect-square rounded-2xl overflow-hidden relative mb-2 shadow-sm border border-[#1D1D1D]/5">
                  <Image source={{ uri: track.cover_url }} className="w-full h-full" />
                  <View className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 items-center justify-center">
                    <Play size={10} color="#1D1D1D" fill="#1D1D1D" />
                  </View>
                </View>
                <Text className={`text-xs font-semibold truncate ${textMain}`}>{track.album}</Text>
                <Text className={`text-[10px] truncate ${textMuted}`}>{track.artist}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section: Playlists */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-[11px] font-bold tracking-widest uppercase ${textMuted}`}>Playlists</Text>
            <Text className={`text-[10px] font-semibold ${textMuted}`}>See all</Text>
          </View>

          <View className="flex-row justify-between">
            {['Chill', 'Focus', 'Late Night'].map((pName, idx) => (
              <View 
                key={idx} 
                className={`w-[30%] aspect-square rounded-2xl p-3 justify-between border ${surfaceStyle}`}
              >
                <Text className={`text-[11px] font-bold ${textMain}`}>{pName}</Text>
                <Text className={`text-[9px] ${textMuted}`}>{idx + 12} songs</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Mini Player (just above tabs) */}
      {currentTrack && (
        <View 
          className="absolute bottom-20 left-4 right-4 h-14 rounded-2xl flex-row items-center px-3 border shadow-md justify-between"
          style={{
            backgroundColor: isDarkTheme ? '#1A1A1A' : '#E8E4DD',
            borderColor: isDarkTheme ? '#2A2A2A' : '#D8D4CD',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {/* Main info tap area */}
          <TouchableOpacity 
            onPress={onOpenPlayer}
            className="flex-1 flex-row items-center mr-4"
            activeOpacity={0.9}
          >
            <Image source={{ uri: currentTrack.cover_url }} className="w-9 h-9 rounded-lg" />
            <View className="ml-3 flex-1">
              <Text className={`text-xs font-semibold truncate ${textMain}`}>{currentTrack.title}</Text>
              <Text className={`text-[10px] truncate ${textMuted}`}>{currentTrack.artist}</Text>
            </View>
          </TouchableOpacity>

          {/* Quick buttons */}
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={onTogglePlay} 
              className="w-8 h-8 rounded-full items-center justify-center mr-1"
            >
              {isPlaying ? (
                <Pause size={14} color={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} fill={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} />
              ) : (
                <Play size={14} color={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} fill={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onNextTrack}
              className="w-8 h-8 rounded-full items-center justify-center"
            >
              <SkipForward size={14} color={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
