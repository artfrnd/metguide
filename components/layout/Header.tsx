'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, Minus, Plus, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavoritesStore } from '@/lib/stores/favorites-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useFontSizeStore, type FontSize } from '@/lib/stores/font-size-store';
import { useDarkModeStore } from '@/lib/stores/dark-mode-store';

export function Header() {
  const pathname = usePathname();
  const { favorites } = useFavoritesStore();
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { fontSize, setFontSize } = useFontSizeStore();
  const { isDarkMode, toggleDarkMode } = useDarkModeStore();

  const decreaseFontSize = () => {
    const sizes: FontSize[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  const increaseFontSize = () => {
    const sizes: FontSize[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-lg font-bold text-blue-900 dark:text-blue-400">
              THE <span className="font-normal">MET</span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Font Size Buttons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={decreaseFontSize}
              disabled={fontSize === 'small'}
              className="h-8 w-8"
              title="글자 크기 줄이기"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={increaseFontSize}
              disabled={fontSize === 'large'}
              className="h-8 w-8"
              title="글자 크기 키우기"
            >
              <Plus className="h-4 w-4" />
            </Button>

            {/* Dark Mode Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-8 w-8"
              title={isDarkMode ? '라이트 모드' : '다크 모드'}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>
            {(pathname === '/' || pathname?.startsWith('/artists/')) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-8 w-8"
                title="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
