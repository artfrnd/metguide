'use client';

import { Exhibition } from '@/types/exhibition';
import Image from 'next/image';
import Link from 'next/link';

interface ExhibitionCardProps {
  exhibition: Exhibition;
}

export default function ExhibitionCard({ exhibition }: ExhibitionCardProps) {
  const isActive = new Date() >= new Date(exhibition.startDate) && new Date() <= new Date(exhibition.endDate);

  return (
    <Link
      href={`/exhibition/${exhibition.id}/vr`}
      className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-gray-200 dark:bg-gray-700">
        {exhibition.thumbnailUrl && (
          <Image
            src={exhibition.thumbnailUrl}
            alt={exhibition.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={80}
          />
        )}
        {isActive && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Active
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {exhibition.title}
        </h3>
        {exhibition.titleKo && (
          <p className="text-gray-600 dark:text-gray-400">
            {exhibition.titleKo}
          </p>
        )}
      </div>
    </Link>
  );
}
