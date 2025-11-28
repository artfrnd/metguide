'use client';

import { useState, useEffect } from 'react';
import { Headphones, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { audioGuideData, YOUTUBE_VIDEO_ID } from '@/lib/data/audio-guide-data';
import { Artwork } from '@/types/artwork';
import exhibitionCompleteData from '@/lib/data/exhibition-complete.json';
import { useFontSizeStore, getFontSizeClasses } from '@/lib/stores/font-size-store';
import { cn } from '@/lib/utils/cn';

export default function AudioPage() {
  const { fontSize } = useFontSizeStore();
  const fontClasses = getFontSizeClasses(fontSize);
  const [currentTimestamp, setCurrentTimestamp] = useState<string>('104s');
  const [audioGuideWithImages, setAudioGuideWithImages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    // Match audio guide data with artwork images
    const artworksData = exhibitionCompleteData.artworks as Artwork[];

    // Create artist name mapping (English to Korean)
    const artistMapping: Record<string, string> = {
      'Salvador Dali': '살바도르 달리',
      'Gustave Courbet': '귀스타브 쿠르베',
      'Henri Matisse': '앙리 마티스',
      'Paul Cezanne': '폴 세잔',
      'Paul Gauguin': '폴 고갱',
      'Pierre-Auguste Cot': '피에르 오귀스트 코',
      'Raimundo de Madrazo y Garreta': '라이문도 데 마드라소',
      'Gustave Moreau': '귀스타브 모로',
      'Odilon Redon': '오딜롱 르동',
      'Edouard Vuillard': '에두아르 뷔야르',
      'Auguste Renoir': '오귀스트 르누아르',
      'Mary Cassatt': '메리 커샛',
      'Kees van Dongen': '키스 반 동겐',
      'Theodore Rousseau': '테오도르 루소',
      'Jules Dupre': '쥘 뒤프레',
      'Charles-Francois Daubigny': '샤를 프랑수아 도비니',
      'Henri-Edmond Cross': '앙리 에드몽 크로스',
      'Vincent van Gogh': '빈센트 반 고흐',
      'Camille Pissarro': '카미유 피사로',
      'Alfred Sisley': '알프레드 시슬레',
      'Pierre Bonnard': '피에르 보나르',
      'Albert Marquet': '알베르 마르케',
      'Maurice de Vlaminck': '모리스 드 블라맹크',
      'Paul Signac': '폴 시냐크'
    };

    const matched = audioGuideData.map(guide => {
      // Get Korean artist name
      const koreanArtist = artistMapping[guide.artist] || guide.artist;

      // Try to find matching artwork by Korean artist name
      const artwork = artworksData.find(art => {
        // Check if artist name matches (with or without dates)
        const artistNameWithoutDates = art.artist.replace(/\s*\([^)]*\)\s*/g, '').trim();
        const matches = artistNameWithoutDates.includes(koreanArtist) ||
               koreanArtist.includes(artistNameWithoutDates);

        // For debugging - log first few matches
        if (matches && guide === audioGuideData[0]) {
          console.log('Matched:', guide.artist, '->', art.artist, art.title, art.imageUrl);
        }

        return matches;
      });

      const imageUrl = artwork?.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image';

      // Log if no match found
      if (!artwork) {
        console.log('No match found for:', guide.artist, guide.title);
      }

      return {
        ...guide,
        imageUrl
      };
    });

    setAudioGuideWithImages(matched);
  }, []);

  const handlePlayAudio = (timestamp: string) => {
    setCurrentTimestamp(timestamp);
    // Scroll to top to see video
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setImageError(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < audioGuideWithImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setImageError(false);
    }
  };

  const handlePlayCurrent = () => {
    if (audioGuideWithImages[currentIndex]) {
      handlePlayAudio(audioGuideWithImages[currentIndex].youtubeTimestamp);
    }
  };

  const currentItem = audioGuideWithImages[currentIndex];

  if (audioGuideWithImages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* YouTube Player */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mx-auto" style={{ maxWidth: '800px' }}>
          <div className="aspect-video">
            <iframe
              key={currentTimestamp}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?start=${parseInt(currentTimestamp)}&autoplay=1`}
              title="전시 오디오 가이드"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Carousel Card */}
        {currentItem && (
          <div className="relative">
            {/* Progress Indicator */}
            <div className="flex justify-center mb-4 gap-1">
              {audioGuideWithImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-blue-600'
                      : 'w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to item ${index + 1}`}
                />
              ))}
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-w-2xl mx-auto">
              {/* Chapter Badge */}
              {currentItem.chapter && (
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2">
                  <p className="text-white text-sm font-medium text-center">
                    {currentItem.chapter}
                  </p>
                </div>
              )}

              {/* Artwork Image */}
              <div className="relative h-80 bg-gray-200 dark:bg-gray-700">
                {!imageError ? (
                  <Image
                    src={currentItem.imageUrl}
                    alt={currentItem.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 672px"
                    priority
                    onError={() => {
                      console.error('Image load error:', currentItem.imageUrl);
                      setImageError(true);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-24 h-24 mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">이미지를 불러올 수 없습니다</p>
                    <p className="text-xs mt-1">{currentItem.artist}</p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <p className={cn("text-blue-600 dark:text-blue-400 font-semibold mb-2", fontClasses.text)}>
                    {currentItem.artist}
                  </p>
                  <h2 className={cn("font-bold text-gray-900 dark:text-white mb-3", fontClasses.heading2)}>
                    {currentItem.title}
                  </h2>
                </div>

                {currentItem.description && (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className={cn("text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line", fontClasses.body)}>
                      {currentItem.description}
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className={cn("flex items-center justify-between text-gray-500 dark:text-gray-400", fontClasses.text)}>
                    <span className="flex items-center gap-2">
                      <Headphones className="w-4 h-4" />
                      오디오 가이드
                    </span>
                    <span className="font-mono font-semibold">
                      {Math.floor(parseInt(currentItem.youtubeTimestamp) / 60)}:
                      {(parseInt(currentItem.youtubeTimestamp) % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controller */}
      <div className="fixed bottom-16 left-0 right-0 bg-transparent z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-8">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full transition-all ${
                currentIndex === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              }`}
              aria-label="이전"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={3} />
            </button>

            {/* Play Button */}
            <button
              onClick={handlePlayCurrent}
              className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              aria-label="재생"
            >
              <Play className="w-6 h-6" fill="white" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentIndex === audioGuideWithImages.length - 1}
              className={`p-3 rounded-full transition-all ${
                currentIndex === audioGuideWithImages.length - 1
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              }`}
              aria-label="다음"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
