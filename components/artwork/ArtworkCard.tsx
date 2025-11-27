'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Share2 } from 'lucide-react';
import { Artwork, ViewMode } from '@/types/artwork';
import { useFavoritesStore } from '@/lib/stores/favorites-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface ArtworkCardProps {
  artwork: Artwork;
  viewMode: ViewMode;
  linkTo?: string;
}

export function ArtworkCard({ artwork, viewMode, linkTo }: ArtworkCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(artwork.id);
  const artworkLink = linkTo || `/artworks/${artwork.id}`;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(artwork.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: `${artwork.title} by ${artwork.artist}`,
        url: `/artworks/${artwork.id}`,
      });
    }
  };

  if (viewMode === 'list') {
    return (
      <Link
        href={artworkLink}
        className="group flex gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all hover:shadow-md"
      >
        <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="128px"
            quality={75}
          />
        </div>
        <div className="flex flex-1 flex-col">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-400">
            #{artwork.id} - {artwork.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {artwork.artist} ({artwork.year})
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {artwork.medium} • {artwork.section}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
            className="h-8 w-8"
          >
            <Heart
              className={cn('h-4 w-4', favorite && 'fill-red-500 text-red-500')}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="h-8 w-8"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={artworkLink}
      className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          quality={80}
        />
        <div className="absolute right-2 top-2 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
            className="h-8 w-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
          >
            <Heart
              className={cn('h-4 w-4', favorite && 'fill-red-500 text-red-500')}
            />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-900 dark:group-hover:text-blue-400">
          {artwork.title}
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{artwork.artist}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">{artwork.year}</p>
      </div>
    </Link>
  );
}
