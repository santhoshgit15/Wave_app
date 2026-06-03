import * as MediaLibrary from 'expo-media-library';
import { Track } from './supabaseClient';

export class MediaLibraryService {
  async requestPermissions(): Promise<boolean> {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  }

  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  async getLocalTracks(): Promise<Track[]> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.warn('Media Library permission denied');
      return [];
    }

    try {
      // Fetch audio files from the device
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 100, // Fetch up to 100 tracks for now
      });

      return media.assets.map((asset) => {
        // Fallback title from filename if no title
        const filenameWithoutExt = asset.filename.split('.').slice(0, -1).join('.') || asset.filename;
        
        return {
          id: asset.id,
          title: filenameWithoutExt, // MediaLibrary doesn't expose ID3 title directly on Asset in older versions, filename is safe
          artist: 'Local Device', 
          album: 'Device Storage',
          duration: this.formatDuration(asset.duration),
          audio_url: asset.uri,
          // Premium default placeholder for local tracks without embedded covers
          cover_url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&q=80',
          liked: false,
        };
      });
    } catch (error) {
      console.error('Error fetching local media:', error);
      return [];
    }
  }
}

export const mediaLibraryService = new MediaLibraryService();
export default mediaLibraryService;
