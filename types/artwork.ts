export interface Artwork {
  id: string | number;
  title: string;
  artist: string;
  year: string;
  medium: string;
  description: string;
  imageUrl: string;

  // Optional fields for traditional exhibition view
  collection?: string;
  section?: string;
  url?: string;

  // Optional fields for VR exhibition
  exhibitionId?: string;
  titleKo?: string;
  artistKo?: string;
  descriptionKo?: string;
  dimensions?: string;
  audioGuideUrl?: string;
  audioGuideId?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export interface Section {
  id: string;
  name: string;
  subtitle: string;
  description?: string;
  artworks: (string | number)[];
}

export interface ExhibitionData {
  title: string;
  englishTitle: string;
  subtitle: string;
  dates: string;
  venue: string;
  totalArtworks: number;
  sections: Section[];
  artworks: Artwork[];
}

export type ViewMode = 'grid' | 'list';

export type SortOption = 'chronological' | 'artist' | 'title';

export interface FilterOptions {
  section?: string;
  artist?: string;
  yearRange?: [number, number];
  medium?: string;
  searchQuery?: string;
}
