import { Audio } from 'expo-av';
import { Track } from './supabaseClient';

class AudioService {
  private sound: Audio.Sound | null = null;
  private currentTrack: Track | null = null;
  private isPlaying: boolean = false;
  private updateCallback: ((status: any) => void) | null = null;

  async init() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldRouteThroughEarpieceAndroid: false,
        playThroughEarpieceAndroid: false,
      });
    } catch (e) {
      console.warn('Failed to set audio mode:', e);
    }
  }

  async loadTrack(track: Track, onStatusUpdate: (status: any) => void) {
    this.updateCallback = onStatusUpdate;
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      this.currentTrack = track;
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audio_url },
        { shouldPlay: false },
        this.onPlaybackStatusUpdate.bind(this)
      );

      this.sound = sound;
    } catch (error) {
      console.error('Failed to load track:', error);
      // Mock playback updates for offline demonstration/fallback
      this.startOfflineMock(track);
    }
  }

  private mockInterval: NodeJS.Timeout | null = null;
  private mockPosition = 0;

  private startOfflineMock(track: Track) {
    if (this.mockInterval) clearInterval(this.mockInterval);
    this.mockPosition = 0;
    this.mockInterval = setInterval(() => {
      if (this.isPlaying) {
        this.mockPosition += 1000;
        const totalDuration = 180000; // 3 minutes standard mock
        if (this.mockPosition >= totalDuration) {
          this.mockPosition = 0;
        }
        if (this.updateCallback) {
          this.updateCallback({
            isLoaded: true,
            isPlaying: this.isPlaying,
            positionMillis: this.mockPosition,
            durationMillis: totalDuration,
          });
        }
      }
    }, 1000);
  }

  private onPlaybackStatusUpdate(status: any) {
    if (!status.isLoaded) {
      if (status.error) {
        console.error(`Playback error: ${status.error}`);
      }
      return;
    }

    this.isPlaying = status.isPlaying;

    if (this.updateCallback) {
      this.updateCallback(status);
    }
  }

  async play() {
    this.isPlaying = true;
    if (this.sound) {
      await this.sound.playAsync();
    }
  }

  async pause() {
    this.isPlaying = false;
    if (this.sound) {
      await this.sound.pauseAsync();
    }
  }

  async seek(positionMillis: number) {
    if (this.sound) {
      await this.sound.setPositionAsync(positionMillis);
    } else {
      this.mockPosition = positionMillis;
    }
  }

  async setVolume(volume: number) {
    if (this.sound) {
      await this.sound.setVolumeAsync(volume);
    }
  }

  async setBass(bassLevel: number) {
    // In standard expo-av, custom low-shelf filter Node is not directly accessible without a native extension.
    // We document this hook for the native equalizers, or mock it by altering volume/gain if needed.
    console.log(`Setting bass EQ level to: ${bassLevel}`);
  }

  async unload() {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
    }
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
    this.currentTrack = null;
  }
}

export const audioService = new AudioService();
export default audioService;
