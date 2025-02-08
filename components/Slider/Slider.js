"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, memo } from "react";
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './Slider.module.css';

const Slider = dynamic(() => import('react-slick'), {
  ssr: false,
  loading: () => <div className={styles.placeholder}>Yükleniyor...</div>
});

const CustomSlider = memo(({ banners }) => {
  const [loadedImages, setLoadedImages] = useState({});

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
    pauseOnHover: true,
    swipeToSlide: true,
    adaptiveHeight: true,
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
            <div className={styles.imageWrapper}>
              {banner?.image && (
                <Image
                  src={banner.image}
                  alt={banner.title || `Banner ${index + 1}`}
                  width={1920}
                  height={1080}
                  priority={index === 0}
                  quality={75}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%'
                  }}
                  onLoad={() => handleImageLoad(index)}
                />
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
});

CustomSlider.displayName = 'CustomSlider';

export default CustomSlider;
