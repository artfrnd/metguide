'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { InfiniteScrollFeed } from './InfiniteScrollFeed';
import { ArtworkGridMenu } from './ArtworkGridMenu';
import { Artwork, Section } from '@/types/artwork';

interface FeedContainerProps {
  artworks: Artwork[];
  sections: Section[];
}

export function FeedContainer({ artworks, sections }: FeedContainerProps) {
  const [currentArtworkId, setCurrentArtworkId] = useState<string | number | undefined>();
  const searchParams = useSearchParams();
  const targetArtworkId = searchParams.get('artwork');

  return (
    <>
      <div className="mx-auto max-w-7xl px-0 sm:px-4 py-0 sm:py-6 lg:px-8">
        <InfiniteScrollFeed
          artworks={artworks}
          onCurrentArtworkChange={setCurrentArtworkId}
          targetArtworkId={targetArtworkId ? (isNaN(Number(targetArtworkId)) ? targetArtworkId : parseInt(targetArtworkId)) : undefined}
        />
      </div>

      {/* Artwork Grid Menu */}
      <ArtworkGridMenu
        artworks={artworks}
        sections={sections}
        currentArtworkId={currentArtworkId}
      />
    </>
  );
}
