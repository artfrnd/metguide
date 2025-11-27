'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui-store';
import { Button } from '@/components/ui/button';
import { ArtistInfo, getArtistSlug } from '@/lib/data/artists';
import { artistAvatars } from '@/lib/utils/avatar';

interface ArtistGridMenuProps {
  artists: ArtistInfo[];
  currentArtistName?: string;
}

export function ArtistGridMenu({ artists, currentArtistName }: ArtistGridMenuProps) {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const router = useRouter();
  const [avatarErrors, setAvatarErrors] = useState<Record<string, boolean>>({});

  const handleArtistClick = (artistName: string) => {
    const slug = getArtistSlug(artistName);
    setMobileMenuOpen(false);
    router.push(`/artists/${slug}`);
  };

  // Extract first name from full name
  const getFirstName = (fullName: string): string => {
    // Remove birth-death years in parentheses
    const nameWithoutYears = fullName.replace(/\s*\([^)]*\)\s*$/, '');
    // Get the last word (usually the given name in Korean artist names)
    const parts = nameWithoutYears.trim().split(/\s+/);
    return parts[parts.length - 1];
  };

  const getAvatarSrc = (artistName: string): string => {
    const localAvatarPath = artistAvatars[artistName];
    if (!avatarErrors[artistName] && localAvatarPath) {
      return localAvatarPath;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(artistName)}&background=random&size=100`;
  };

  const handleAvatarError = (artistName: string) => {
    setAvatarErrors(prev => ({ ...prev, [artistName]: true }));
  };

  return (
    <>
      {/* Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Slide Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[calc(100%-3rem)] sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">작가 목록</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-4 gap-4">
              {artists.map((artist) => {
                const isCurrentArtist = artist.name === currentArtistName;
                return (
                  <button
                    key={artist.name}
                    onClick={() => handleArtistClick(artist.name)}
                    className={`flex flex-col items-center gap-2 transition-all hover:scale-105 ${
                      isCurrentArtist ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${
                        isCurrentArtist
                          ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2'
                          : 'border-gray-300'
                      }`}
                    >
                      <Image
                        src={getAvatarSrc(artist.name)}
                        alt={artist.name}
                        fill
                        className="object-cover"
                        onError={() => handleAvatarError(artist.name)}
                        sizes="64px"
                        quality={75}
                      />
                    </div>
                    {/* Name */}
                    <span className="text-xs text-center text-gray-700 font-medium leading-tight">
                      {getFirstName(artist.name)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
