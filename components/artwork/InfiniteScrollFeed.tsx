'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Artwork } from '@/types/artwork';
import { ArtworkPost } from './ArtworkPost';
import { useFontSizeStore, getFontSizeClasses } from '@/lib/stores/font-size-store';

interface InfiniteScrollFeedProps {
  artworks: Artwork[];
  onCurrentArtworkChange?: (artworkId: string | number) => void;
  targetArtworkId?: string | number;
}

export function InfiniteScrollFeed({ artworks, onCurrentArtworkChange, targetArtworkId }: InfiniteScrollFeedProps) {
  const { fontSize } = useFontSizeStore();
  const fontClasses = getFontSizeClasses(fontSize);
  const [displayedArtworks, setDisplayedArtworks] = useState<Artwork[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const artworkRefs = useRef<Map<string | number, HTMLDivElement>>(new Map());
  const initialLoadRef = useRef(false);
  const hasScrolledToTarget = useRef(false);

  const ITEMS_PER_PAGE = 10;

  const loadMore = useCallback(() => {
    // Prevent concurrent loading
    if (isLoading || !hasMore) {
      return;
    }

    setIsLoading(true);

    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newArtworks = artworks.slice(startIndex, endIndex);

    if (newArtworks.length === 0) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }

    setDisplayedArtworks((prev) => {
      // Additional safety check: prevent adding duplicate IDs
      const existingIds = new Set(prev.map(a => a.id));
      const uniqueNewArtworks = newArtworks.filter(a => !existingIds.has(a.id));
      return [...prev, ...uniqueNewArtworks];
    });
    setPage((prev) => prev + 1);

    if (endIndex >= artworks.length) {
      setHasMore(false);
    }

    setIsLoading(false);
  }, [artworks, page, isLoading, hasMore, ITEMS_PER_PAGE]);

  useEffect(() => {
    // Load initial items only once
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;

      // If there's a target artwork, load up to that artwork
      if (targetArtworkId) {
        const targetIndex = artworks.findIndex(a => a.id === targetArtworkId);
        if (targetIndex !== -1) {
          // Load all artworks up to and including the target
          const itemsToLoad = targetIndex + 1;
          const pagesNeeded = Math.ceil(itemsToLoad / ITEMS_PER_PAGE);
          const endIndex = pagesNeeded * ITEMS_PER_PAGE;

          setDisplayedArtworks(artworks.slice(0, endIndex));
          setPage(pagesNeeded);

          if (endIndex >= artworks.length) {
            setHasMore(false);
          }
          return;
        }
      }

      // Normal initial load
      loadMore();
    }
  }, [loadMore, artworks, targetArtworkId, ITEMS_PER_PAGE]);

  // Scroll to target artwork after it's rendered
  useEffect(() => {
    if (targetArtworkId && !hasScrolledToTarget.current && displayedArtworks.length > 0) {
      const targetElement = document.getElementById(`artwork-${targetArtworkId}`);
      if (targetElement) {
        hasScrolledToTarget.current = true;
        setTimeout(() => {
          // Get header height to offset scroll position
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 64;

          // Calculate position to scroll to (top of element minus header height)
          const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerHeight - 8; // 8px extra padding

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [targetArtworkId, displayedArtworks]);

  useEffect(() => {
    // Intersection Observer for infinite scroll
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader && hasMore) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoading, loadMore]);

  useEffect(() => {
    // Intersection Observer for tracking current artwork
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const artworkId = parseInt(entry.target.id.replace('artwork-', ''));
            if (onCurrentArtworkChange) {
              onCurrentArtworkChange(artworkId);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    artworkRefs.current.forEach((ref) => {
      observer.observe(ref);
    });

    return () => {
      artworkRefs.current.forEach((ref) => {
        observer.unobserve(ref);
      });
    };
  }, [displayedArtworks, onCurrentArtworkChange]);

  return (
    <div className="max-w-[700px] mx-auto space-y-0 sm:space-y-0">
      {displayedArtworks.map((artwork, index) => (
        <div
          key={artwork.id}
          id={`artwork-${artwork.id}`}
          ref={(el) => {
            if (el) {
              artworkRefs.current.set(artwork.id, el);
            }
          }}
          className={index > 0 ? 'border-t-8 sm:border-t-0 border-gray-100' : ''}
        >
          <ArtworkPost artwork={artwork} />
        </div>
      ))}

      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-8">
          <div className={`animate-pulse text-gray-500 ${fontClasses.text}`}>
            로딩 중...
          </div>
        </div>
      )}

      {!hasMore && displayedArtworks.length > 0 && (
        <div className={`text-center py-8 text-gray-500 ${fontClasses.text}`}>
          모든 작품을 확인했습니다
        </div>
      )}
    </div>
  );
}
