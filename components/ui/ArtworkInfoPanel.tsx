'use client';

import { Artwork } from '@/types/artwork';
import Image from 'next/image';

interface ArtworkInfoPanelProps {
  artwork: Artwork | null;
  onClose: () => void;
  onPlayAudio?: () => void;
}

export default function ArtworkInfoPanel({
  artwork,
  onClose,
  onPlayAudio,
}: ArtworkInfoPanelProps) {
  if (!artwork) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-40 overflow-y-auto transform transition-transform duration-300">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Artwork Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Image */}
        {artwork.imageUrl && (
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
              quality={85}
            />
          </div>
        )}

        {/* Title */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {artwork.title}
          </h3>
          {artwork.titleKo && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {artwork.titleKo}
            </p>
          )}
        </div>

        {/* Artist */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Artist
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {artwork.artist}
          </p>
          {artwork.artistKo && (
            <p className="text-gray-600 dark:text-gray-400">{artwork.artistKo}</p>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Year
            </p>
            <p className="text-gray-900 dark:text-white font-medium">
              {artwork.year}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Dimensions
            </p>
            <p className="text-gray-900 dark:text-white font-medium">
              {artwork.dimensions}
            </p>
          </div>
        </div>

        {/* Medium */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Medium
          </p>
          <p className="text-gray-900 dark:text-white">{artwork.medium}</p>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Description
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {artwork.description}
          </p>
          {artwork.descriptionKo && (
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
              {artwork.descriptionKo}
            </p>
          )}
        </div>

        {/* Audio Guide Button */}
        {artwork.audioGuideUrl && onPlayAudio && (
          <button
            onClick={onPlayAudio}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            Play Audio Guide
          </button>
        )}
      </div>
    </div>
  );
}
