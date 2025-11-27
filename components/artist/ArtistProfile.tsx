'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Artwork } from '@/types/artwork';
import { ArtistInfo, getArtistSlug } from '@/lib/data/artists';
import { artistAvatars } from '@/lib/utils/avatar';

interface ArtistProfileProps {
  artistInfo: ArtistInfo;
  artworks: Artwork[];
}

export function ArtistProfile({ artistInfo, artworks }: ArtistProfileProps) {
  const [avatarError, setAvatarError] = useState(false);
  const [showFullBiography, setShowFullBiography] = useState(false);

  // Get avatar image source
  const localAvatarPath = artistAvatars[artistInfo.name];
  const avatarSrc = (!avatarError && localAvatarPath)
    ? localAvatarPath
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(artistInfo.name)}&background=random&size=150`;

  // Biography display logic
  const biographyText = artistInfo.biography || '';
  const shouldShowMore = biographyText.length > 100;
  const displayedBiography = showFullBiography || !shouldShowMore
    ? biographyText
    : biographyText.slice(0, 100) + '...';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Profile Header - Instagram Style */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 mb-6 shadow-sm">
          <div className="flex flex-row gap-4 sm:gap-12">
            {/* Avatar */}
            <div className="flex justify-start">
              <div className="relative w-20 h-20 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gray-200 shrink-0 border-4 border-gray-100">
                <Image
                  src={avatarSrc}
                  alt={artistInfo.name}
                  fill
                  className="object-cover"
                  onError={() => setAvatarError(true)}
                  sizes="(max-width: 640px) 80px, 160px"
                  quality={85}
                  priority
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-5">
              {/* Name and Stats */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight" style={{fontFamily: 'var(--font-noto-sans-kr), sans-serif', fontWeight: 700}}>
                  {artistInfo.name}
                </h1>
                {artistInfo.movement && (
                  <p className="text-base text-gray-600 mb-4" style={{fontFamily: 'var(--font-noto-sans-kr), sans-serif', fontWeight: 400}}>
                    {artistInfo.movement}
                  </p>
                )}
              </div>

              {/* Stats Row */}
              <div className="flex gap-6 sm:gap-10 text-left">
                <div>
                  <div className="text-2xl font-bold text-gray-900" style={{fontFamily: 'var(--font-noto-sans-kr), sans-serif', fontWeight: 700}}>{artworks.length}</div>
                  <div className="text-sm text-gray-600 mt-1" style={{fontFamily: 'var(--font-noto-sans-kr), sans-serif', fontWeight: 400}}>작품</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900" style={{fontFamily: 'var(--font-noto-sans-kr), sans-serif', fontWeight: 700}}>{artistInfo.relatedArtists.length}</div>
                  <div className="text-sm text-gray-600 mt-1" style={{fontFamily: 'var(--font-noto-sans-kr), sans-serif', fontWeight: 400}}>관련 작가</div>
                </div>
              </div>

              {/* Biography */}
              <div className="pt-2">
                <p className="text-base text-gray-700 leading-loose" style={{fontFamily: 'var(--font-noto-sans-kr), sans-serif', fontWeight: 400, letterSpacing: '-0.01em'}}>
                  {displayedBiography}
                  {shouldShowMore && !showFullBiography && (
                    <button
                      onClick={() => setShowFullBiography(true)}
                      className="text-gray-600 hover:text-gray-900 font-medium ml-2"
                      style={{fontFamily: 'var(--font-noto-sans-kr), sans-serif', fontWeight: 500}}
                    >
                      더보기
                    </button>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Artists Section */}
        {artistInfo.relatedArtists.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4" style={{fontFamily: 'var(--font-noto-sans-kr), sans-serif', fontWeight: 700}}>관련 작가</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {artistInfo.relatedArtists.map((relatedArtist) => {
                const relatedAvatarPath = artistAvatars[relatedArtist];
                const relatedAvatarSrc = relatedAvatarPath
                  ? relatedAvatarPath
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(relatedArtist)}&background=random&size=80`;

                return (
                  <Link
                    key={relatedArtist}
                    href={`/artists/${getArtistSlug(relatedArtist)}`}
                    className="flex flex-col items-center gap-2 min-w-[80px] hover:opacity-75 transition-opacity"
                  >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                      <Image
                        src={relatedAvatarSrc}
                        alt={relatedArtist}
                        fill
                        className="object-cover"
                        sizes="64px"
                        quality={75}
                      />
                    </div>
                    <div className="text-xs text-center text-gray-700 max-w-[80px] truncate" style={{fontFamily: 'var(--font-noto-sans-kr), sans-serif', fontWeight: 500}}>
                      {relatedArtist.split(' (')[0]}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Artworks Grid */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4" style={{fontFamily: 'var(--font-noto-sans-kr), sans-serif', fontWeight: 700}}>
            전시 작품 ({artworks.length})
          </h2>

          {artworks.length === 0 ? (
            <p className="text-center text-gray-500 py-8" style={{fontFamily: 'var(--font-noto-sans-kr), sans-serif', fontWeight: 400}}>
              이 전시에 출품된 작품이 없습니다
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {artworks.map((artwork) => (
                <Link
                  key={artwork.id}
                  href={`/?artwork=${artwork.id}`}
                  className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                >
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    quality={80}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-white text-center p-2">
                      <p className="text-xs sm:text-sm font-medium line-clamp-2">
                        {artwork.title}
                      </p>
                      {artwork.year && (
                        <p className="text-xs mt-1 opacity-90">{artwork.year}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
