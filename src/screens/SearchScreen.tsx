import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Search as SearchIcon, X, ArrowLeft } from 'lucide-react-native';
import { Track } from '../services/supabaseClient';

interface SearchScreenProps {
  tracks: Track[];
  onSelectTrack: (track: Track) => void;
  onClose: () => void;
  isDarkTheme?: boolean;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  tracks,
  onSelectTrack,
  onClose,
  isDarkTheme = false
}) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Frank Ocean',
    'Cigarettes After Sex',
    'Nils Frahm',
    'Flume',
    'Bon Iver'
  ]);

  const deleteRecent = (termToDelete: string) => {
    setRecentSearches(recentSearches.filter(t => t !== termToDelete));
  };

  const filteredTracks = query.trim() === '' ? [] : tracks.filter(track => {
    const term = query.toLowerCase();
    return (
      track.title.toLowerCase().includes(term) ||
      track.artist.toLowerCase().includes(term) ||
      track.album.toLowerCase().includes(term)
    );
  });

  const bgStyle = isDarkTheme ? 'bg-[#111111]' : 'bg-[#F4F1EA]';
  const inputStyle = isDarkTheme ? 'bg-[#1A1A1A] border-[#2A2A2A] text-[#EAEAEA]' : 'bg-[#E8E4DD] border-[#D8D4CD] text-[#1D1D1D]';
  const textMain = isDarkTheme ? 'text-[#EAEAEA]' : 'text-[#1D1D1D]';
  const textMuted = isDarkTheme ? 'text-[#9A9893]' : 'text-[#706E6A]';
  const borderBottom = isDarkTheme ? 'border-b border-[#2A2A2A]' : 'border-b border-[#D8D4CD]/50';

  return (
    <View className={`flex-1 ${bgStyle} pt-12 px-5`}>
      {/* Header with back trigger */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={onClose} className="mr-3">
          <ArrowLeft size={20} color={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} />
        </TouchableOpacity>
        <Text className={`text-lg font-bold tracking-[3px] ${textMain}`}>SEARCH</Text>
      </View>

      {/* Recessed Search Bar */}
      <View className={`flex-row items-center h-12 px-4 rounded-xl border ${inputStyle} mb-6`}>
        <SearchIcon size={16} color={isDarkTheme ? '#9A9893' : '#706E6A'} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search for songs, artists, albums"
          placeholderTextColor={isDarkTheme ? '#706E6A' : '#9A9893'}
          className="flex-1 ml-3 h-full text-sm font-medium"
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <X size={16} color={isDarkTheme ? '#EAEAEA' : '#1D1D1D'} />
          </TouchableOpacity>
        )}
      </View>

      {/* Result listing */}
      {query.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className={`text-[10px] font-bold tracking-widest uppercase mb-4 ${textMuted}`}>
            Results ({filteredTracks.length})
          </Text>
          {filteredTracks.map(track => (
            <TouchableOpacity
              key={track.id}
              onPress={() => {
                onSelectTrack(track);
                onClose();
              }}
              className={`flex-row items-center py-3 ${borderBottom}`}
              activeOpacity={0.8}
            >
              <Image source={{ uri: track.cover_url }} className="w-11 h-11 rounded-xl" />
              <View className="ml-4 flex-1">
                <Text className={`text-xs font-semibold ${textMain}`}>{track.title}</Text>
                <Text className={`text-[10px] ${textMuted}`}>{track.artist} • {track.album}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {filteredTracks.length === 0 && (
            <View className="py-12 items-center">
              <Text className={`text-sm ${textMuted}`}>No matching tracks found</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        /* Default State: Recent searches & recommendations */
        <View className="flex-1">
          {recentSearches.length > 0 && (
            <View className="mb-6">
              <Text className={`text-[10px] font-bold tracking-widest uppercase mb-3 ${textMuted}`}>
                Recent Searches
              </Text>
              {recentSearches.map((term, index) => (
                <View 
                  key={index} 
                  className={`flex-row justify-between items-center py-3.5 ${borderBottom}`}
                >
                  <TouchableOpacity onPress={() => setQuery(term)}>
                    <Text className={`text-sm font-medium ${textMain}`}>{term}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteRecent(term)}>
                    <X size={14} color={isDarkTheme ? '#706E6A' : '#9A9893'} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          {/* Simple recommendations */}
          <View>
            <Text className={`text-[10px] font-bold tracking-widest uppercase mb-3 ${textMuted}`}>
              Recommended
            </Text>
            {['Radiohead', 'Billie Eilish', 'The Weeknd', 'Tycho'].map((artist, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setQuery(artist)}
                className={`py-3.5 ${borderBottom}`}
              >
                <Text className={`text-sm font-medium ${textMain}`}>{artist}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default SearchScreen;
