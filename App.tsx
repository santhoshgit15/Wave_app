import "./global.css";
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, StatusBar } from 'react-native';
import { Home, Library, Settings } from 'lucide-react-native';
import { audioService } from './src/services/audioService';
import { Track } from './src/services/supabaseClient';
import { SplashScreen } from './src/screens/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { PlayerModal } from './src/screens/PlayerModal';
import { mediaLibraryService } from './src/services/mediaLibraryService';
// Removed hardcoded database

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<'home' | 'library' | 'settings'>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Playback States
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(250000); // Default duration 4:10

  useEffect(() => {
    audioService.init();
    
    // Load local tracks
    const loadTracks = async () => {
      const localTracks = await mediaLibraryService.getLocalTracks();
      setTracks(localTracks);
      if (localTracks.length > 0) {
        setCurrentTrack(localTracks[0]);
      }
    };
    loadTracks();

    return () => {
      audioService.unload();
    };
  }, []);

  const handleSelectTrack = async (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(false);
    setPositionMs(0);
    
    // Load track into player service
    await audioService.loadTrack(track, (status) => {
      if (status.isLoaded) {
        setIsPlaying(status.isPlaying);
        setPositionMs(status.positionMillis);
        setDurationMs(status.durationMillis || 240000);
      }
    });

    // Start playing
    await audioService.play();
    setIsPlaying(true);
  };

  const handleTogglePlay = async () => {
    if (isPlaying) {
      await audioService.pause();
      setIsPlaying(false);
    } else {
      await audioService.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = async (posMs: number) => {
    await audioService.seek(posMs);
    setPositionMs(posMs);
  };

  const handleNextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    handleSelectTrack(tracks[nextIndex]);
  };

  const handlePrevTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = tracks.length - 1;
    handleSelectTrack(tracks[prevIndex]);
  };

  if (showSplash) {
    return (
      <SplashScreen 
        onFinish={() => setShowSplash(false)} 
        isDarkTheme={isDarkTheme} 
      />
    );
  }

  // Theming colors
  const bgTheme = isDarkTheme ? '#111111' : '#F4F1EA';
  const surfaceTheme = isDarkTheme ? '#1A1A1A' : '#E8E4DD';
  const borderTheme = isDarkTheme ? '#2A2A2A' : '#D8D4CD';
  const tabColorActive = isDarkTheme ? '#FF5D45' : '#D84B36'; // Braun Accent
  const tabColorInactive = isDarkTheme ? '#706E6A' : '#9A9893';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgTheme }]}>
      <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'} />

      {/* Screen Router */}
      <View style={styles.content}>
        {currentTab === 'home' && (
          <HomeScreen
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
            onTogglePlay={handleTogglePlay}
            onNextTrack={handleNextTrack}
            onOpenPlayer={() => setIsPlayerOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            isDarkTheme={isDarkTheme}
          />
        )}
        {currentTab === 'library' && (
          <LibraryScreen
            likedSongsCount={tracks.filter(t => t.liked).length}
            tracks={tracks}
            onSelectTrack={handleSelectTrack}
            isDarkTheme={isDarkTheme}
          />
        )}
        {currentTab === 'settings' && (
          <SettingsScreen
            isDarkTheme={isDarkTheme}
            onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
          />
        )}
      </View>

      {/* Slide-in overlays */}
      {isSearchOpen && (
        <View style={[StyleSheet.absoluteFillObject, { zIndex: 1000 }]}>
          <SearchScreen
            tracks={tracks}
            onSelectTrack={handleSelectTrack}
            onClose={() => setIsSearchOpen(false)}
            isDarkTheme={isDarkTheme}
          />
        </View>
      )}

      {/* Full Music Player Modal */}
      {currentTrack && (
        <PlayerModal
          isVisible={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          track={currentTrack}
          isPlaying={isPlaying}
          positionMs={positionMs}
          durationMs={durationMs}
          progress={durationMs > 0 ? positionMs / durationMs : 0}
          onTogglePlay={handleTogglePlay}
          onPrevTrack={handlePrevTrack}
          onNextTrack={handleNextTrack}
          onSeek={handleSeek}
          isDarkTheme={isDarkTheme}
        />
      )}

      {/* Bottom Tab Navigation Bar */}
      <View 
        style={[
          styles.tabBar, 
          { backgroundColor: surfaceTheme, borderColor: borderTheme }
        ]}
      >
        <TouchableOpacity 
          onPress={() => setCurrentTab('home')} 
          style={styles.tabItem}
        >
          <Home size={18} color={currentTab === 'home' ? tabColorActive : tabColorInactive} />
          <Text 
            style={[
              styles.tabLabel, 
              { color: currentTab === 'home' ? tabColorActive : tabColorInactive }
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setCurrentTab('library')} 
          style={styles.tabItem}
        >
          <Library size={18} color={currentTab === 'library' ? tabColorActive : tabColorInactive} />
          <Text 
            style={[
              styles.tabLabel, 
              { color: currentTab === 'library' ? tabColorActive : tabColorInactive }
            ]}
          >
            Library
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setCurrentTab('settings')} 
          style={styles.tabItem}
        >
          <Settings size={18} color={currentTab === 'settings' ? tabColorActive : tabColorInactive} />
          <Text 
            style={[
              styles.tabLabel, 
              { color: currentTab === 'settings' ? tabColorActive : tabColorInactive }
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1.2,
    paddingBottom: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  tabLabel: {
    fontSize: 9,
    fontFamily: 'System',
    fontWeight: 'bold',
    marginTop: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  }
});
