'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Artwork } from '@/types/artwork';
import { useFavoritesStore } from '@/lib/stores/favorites-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { artistAvatars } from '@/lib/utils/avatar';
import { getArtistSlug } from '@/lib/data/artists';
import { useFontSizeStore, getFontSizeClasses } from '@/lib/stores/font-size-store';

interface ArtworkPostProps {
  artwork: Artwork;
}

export function ArtworkPost({ artwork }: ArtworkPostProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { fontSize } = useFontSizeStore();
  const fontClasses = getFontSizeClasses(fontSize);
  const favorite = isFavorite(artwork.id);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [commentCount] = useState(0);
  const [avatarError, setAvatarError] = useState(false);

  const handleLike = () => {
    toggleFavorite(artwork.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: `${artwork.title} by ${artwork.artist}`,
        url: `/artworks/${artwork.id}`,
      });
    }
  };

  const descriptionText = artwork.description || '';
  const shouldShowMore = descriptionText.length > 100;
  const displayedDescription = showFullDescription || !shouldShowMore
    ? descriptionText
    : descriptionText.slice(0, 100) + '...';

  // Get avatar image source (local or fallback to UI avatars)
  const localAvatarPath = artistAvatars[artwork.artist];
  const avatarSrc = (!avatarError && localAvatarPath)
    ? localAvatarPath
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(artwork.artist)}&background=random&size=80`;

  const artistSlug = getArtistSlug(artwork.artist);

  return (
    <div className="bg-white dark:bg-gray-800 border-0 sm:border border-gray-200 dark:border-gray-700 sm:rounded-lg shadow-sm mb-0 sm:mb-4">
      {/* Post Header */}
      <div className="p-3 sm:p-4 flex items-center gap-3">
        <Link href={`/artists/${artistSlug}`} className="flex-shrink-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer hover:opacity-80 transition-opacity">
            <Image
              src={avatarSrc}
              alt={artwork.artist}
              fill
              className="object-cover"
              sizes="40px"
              quality={75}
              onError={() => setAvatarError(true)}
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/artists/${artistSlug}`}>
            <div className={cn("font-bold text-gray-900 dark:text-white truncate hover:opacity-80 transition-opacity cursor-pointer", fontClasses.body)}>
              {artwork.title}
            </div>
          </Link>
          <Link href={`/artists/${artistSlug}`}>
            <div className={cn("text-sm text-gray-600 dark:text-gray-400 hover:opacity-80 transition-opacity cursor-pointer", fontClasses.text)}>
              {artwork.artist} · {artwork.year}
            </div>
          </Link>
        </div>
      </div>

      {/* Post Image */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-gray-700">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, 640px"
          quality={80}
          priority={false}
        />
      </div>

      {/* Action Buttons */}
      <div className="px-3 sm:px-4 py-2 flex items-center gap-0 sm:gap-1 border-t border-b border-gray-100 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            'flex items-center gap-1 sm:gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex-1 justify-center min-h-[44px]',
            favorite && 'text-red-500'
          )}
        >
          <Heart
            className={cn('h-5 w-5', favorite && 'fill-current')}
          />
          <span className="text-sm font-medium">좋아요</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex-1 justify-center min-h-[44px]"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">댓글</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex-1 justify-center min-h-[44px]"
        >
          <Share2 className="h-5 w-5" />
          <span className="text-sm font-medium">공유</span>
        </Button>
      </div>

      {/* Post Content */}
      <div className="px-3 sm:px-4 py-4">
        <div className={fontClasses.text}>
          <span className="font-semibold text-gray-900 dark:text-white">{artwork.artist}</span>
          {descriptionText && (
            <>
              <span className="text-gray-700 dark:text-gray-300 ml-2">
                {displayedDescription}
              </span>
              {shouldShowMore && !showFullDescription && (
                <button
                  onClick={() => setShowFullDescription(true)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium ml-1"
                >
                  더보기
                </button>
              )}
            </>
          )}
        </div>

        {artwork.medium && (
          <div className={cn("text-xs text-gray-500 dark:text-gray-400 mt-2", fontClasses.text)}>
            {artwork.medium}
          </div>
        )}

        {artwork.section && (
          <div className={cn("text-xs text-gray-500 dark:text-gray-400 mt-1", fontClasses.text)}>
            섹션: {artwork.section}
          </div>
        )}

        {commentCount > 0 && (
          <button className={cn("text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mt-2", fontClasses.text)}>
            댓글 {commentCount}개 모두 보기
          </button>
        )}
      </div>
    </div>
  );
}
