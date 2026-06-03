import { createClient } from '@supabase/supabase-js';

// Load environmental variables or use placeholder values for offline development
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Define TypeScript interfaces for our database structure
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string; // MM:SS format
  audio_url: string;
  cover_url: string;
  liked: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  track_count: number;
  tracks: Track[];
}
