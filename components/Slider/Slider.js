"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, memo } from "react";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './Slider.module.css';

const Slider = dynamic(() => import('react-slick'), {
  ssr: false,
  loading: () => <div className={styles.placeholder}>Yükleniyor...</div>
});

const CustomSlider = memo(({ banners }) => {
  const [loadedImages, setLoadedImages] = useState({});

  // useCallback ile performans optimizasyonu
  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  }, []);

  const settings = {
    dots: true,
    infinite: banners.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: banners.length > 1,
    autoplaySpeed: 5000,
    lazyLoad: 'progressive', // Lazy loading ekledik
    pauseOnHover: true,
    swipeToSlide: true, // Mobil için daha iyi swipe
    adaptiveHeight: true, // Görsel yüksekliğine göre otomatik ayarlama
  };

  if (!banners?.length) {
    return (
      <div className={styles.sliderContainer}>
        <div className={styles.placeholder}>Banner verisi bulunamadı</div>
      </div>
    );
  }

  return (
    <div className={styles.sliderContainer}>
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={banner.id || index} className={styles.slide}>
            {!loadedImages[index] && (
              <div className={styles.placeholder}>Yükleniyor...</div>
            )}
            <img
              src={banner.image}
              className={`${styles.sliderImage} ${loadedImages[index] ? styles.loaded : ''}`}
              onLoad={() => handleImageLoad(index)}
              alt={banner.alt || `Banner ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
});

CustomSlider.displayName = 'CustomSlider';

export default CustomSlider;
