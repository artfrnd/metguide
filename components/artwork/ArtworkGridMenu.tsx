'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Artwork, Section } from '@/types/artwork';
import { useUIStore } from '@/lib/stores/ui-store';
import { Button } from '@/components/ui/button';

interface ArtworkGridMenuProps {
  artworks: Artwork[];
  sections: Section[];
  currentArtworkId?: string | number;
}

export function ArtworkGridMenu({ artworks, sections, currentArtworkId }: ArtworkGridMenuProps) {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const router = useRouter();
  const currentArtworkRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to current artwork when menu opens
  useEffect(() => {
    if (mobileMenuOpen && currentArtworkRef.current) {
      setTimeout(() => {
        currentArtworkRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }, [mobileMenuOpen, currentArtworkId]);

  const handleArtworkClick = (artworkId: string | number) => {
    // Check if artwork element exists and is loaded
    const artworkElement = document.getElementById(`artwork-${artworkId}`);

    if (artworkElement) {
      // Close menu first
      setMobileMenuOpen(false);

      // Scroll after menu closes (wait for animation to complete)
      setTimeout(() => {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 64;
        const elementPosition = artworkElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight - 8;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 600);
    } else {
      // Element not loaded - navigate with query parameter
      setMobileMenuOpen(false);
      router.push(`/?artwork=${artworkId}`);
    }
  };

  // Group artworks by section using section's artwork IDs
  const artworksBySection = sections.map(section => ({
    section,
    artworks: artworks.filter(artwork => section.artworks.includes(artwork.id))
  }));

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
      {mobileMenuOpen && (
        <div
          className="fixed top-0 right-0 h-full w-[calc(100%-3rem)] sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0"
        >
          <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">작품 목록</h2>
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
            <div className="space-y-6">
              {artworksBySection.map(({ section, artworks: sectionArtworks }) => (
                <div key={section.id}>
                  {/* Section Header */}
                  <div className="mb-3">
                    <div className="text-sm font-bold text-blue-900">{section.name}</div>
                    <div className="text-xs text-gray-600">{section.subtitle}</div>
                    <div className="text-xs text-gray-500 mt-1">{sectionArtworks.length}개 작품</div>
                  </div>

                  {/* Artwork Grid - 5 per row */}
                  {sectionArtworks.length > 0 ? (
                    <div className="grid grid-cols-5 gap-2">
                      {sectionArtworks.map((artwork) => (
                      <button
                        key={artwork.id}
                        ref={artwork.id === currentArtworkId ? currentArtworkRef : null}
                        onClick={() => handleArtworkClick(artwork.id)}
                        className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all hover:scale-105 ${
                          artwork.id === currentArtworkId
                            ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2'
                            : 'border-gray-200'
                        }`}
                        title={`#${artwork.id} ${artwork.title}`}
                      >
                        <Image
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 20vw, 80px"
                          quality={70}
                        />
                        {/* Artwork number overlay */}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold">#{artwork.id}</span>
                        </div>
                      </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 italic">작품이 없습니다</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      )}
    </>
  );
}
