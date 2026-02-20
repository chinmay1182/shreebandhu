'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiClient } from '@/app/lib/apiClient';
import styles from './BannerCarousel.module.css'; // Using CSS Modules

interface Banner {
  id: number;
  image_url: string;
  display_order: number;
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await apiClient<Banner[]>('/banners');
        setBanners(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load banners');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  if (isLoading) {
    return <div className={styles.bannerLoading}>Loading banners...</div>;
  }

  if (error) {
    return <div className={styles.bannerError}>Error: {error}</div>;
  }

  if (banners.length === 0) {
    return <div className={styles.noBanners}>No banners available</div>;
  }

  return (
    <div className={styles.bannerCarousel}>
      <div className={styles.bannerContainer}>
        <div className={styles.bannerWrapper}>
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`${styles.bannerSlide} ${index === currentBanner ? styles.active : ''}`}
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              <Image
                src={banner.image_url}
                alt={`Banner ${banner.id}`}
                width={1200}
                height={400}
                priority
                className={styles.bannerImage}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/Banner.jpg';
                }}
              />

            </div>
          ))}
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <div className={styles.bannerDots}>
            {banners.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentBanner ? styles.active : ''}`}
                onClick={() => setCurrentBanner(index)}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>

          <button
            className={`${styles.bannerNav} ${styles.prev}`}
            onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
            aria-label="Previous banner"
          >
            &lt;
          </button>
          <button
            className={`${styles.bannerNav} ${styles.next}`}
            onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
            aria-label="Next banner"
          >
            &gt;
          </button>
        </>
      )}
    </div>
  );
}