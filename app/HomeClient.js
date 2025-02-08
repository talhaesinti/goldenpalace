'use client';

import React, { useEffect, useState } from "react";
import CustomSlider from "../components/Slider/Slider";
import TourCard from "../components/TourCard";
import Slider from "react-slick";
import Image from 'next/image';
import {
  Grid,
  Box,
  Alert,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { formatTitle, formatRegionTitle } from "@/utils/formatters";
import styles from "../styles/pages/HomePage.module.css";

const HomeClient = ({ initialBanners = [], initialTours = null, initialRegions = null, toursError, regionsError }) => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handlers
  const handleRegionClick = (region) => router.push(`/yurtdisi/${region.slug}`);
  const handleTourClick = (tour) => {
    if (tour.region) {
      router.push(`/yurtdisi/${tour.region.slug}/${tour.slug}`);
    } else {
      router.push(`/yurtici/${tour.slug}`);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: initialTours?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  // Tur ve bölge içeriğini render eden yardımcı fonksiyonlar
  const renderTourContent = () => {
    if (toursError) {
      return (
        <div className={`${styles.homeContainer} ${styles.errorContainer}`}>
          <div className={styles.errorContent}>
            <Box 
              className={styles.contentBox}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3
              }}
            >
              <h2 className={styles.sectionTitle}>
                {toursError}
              </h2>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRefresh}
                sx={{ minWidth: 200 }}
              >
                Sayfayı Yenile
              </Button>
            </Box>
          </div>
        </div>
      );
    }

    if (!initialTours) {
      return (
        <div className={`${styles.homeContainer} ${styles.errorContainer}`}>
          <div className={styles.errorContent}>
            <Box 
              className={styles.contentBox}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3
              }}
            >
              <h2 className={styles.sectionTitle}>
                Turlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
              </h2>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRefresh}
                sx={{ minWidth: 200 }}
              >
                Sayfayı Yenile
              </Button>
            </Box>
          </div>
        </div>
      );
    }

    if (initialTours.length === 0) {
      return (
        <div className={styles.noResults}>
          <h3 className={styles.noResultsTitle}>
            {formatTitle("Henüz tur bulunmamaktadır")}
          </h3>
        </div>
      );
    }

    return isMobile ? (
      <div className={styles.mobileSliderContainer}>
        <Slider {...sliderSettings}>
          {initialTours.map((tour) => (
            <div key={tour.id} className={styles.tourCardWrapper}>
              <div onClick={() => handleTourClick(tour)}>
                <TourCard tour={{...tour, name: formatTitle(tour.name)}} />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    ) : (
      <div className={styles.toursGrid}>
        {initialTours.map((tour) => (
          <div
            key={tour.id}
            className={styles.tourCardWrapper}
            onClick={() => handleTourClick(tour)}
          >
            <TourCard tour={{...tour, name: formatTitle(tour.name)}} />
          </div>
        ))}
      </div>
    );
  };

  const renderRegionContent = () => {
    if (regionsError) {
      return (
        <div className={`${styles.homeContainer} ${styles.errorContainer}`}>
          <div className={styles.errorContent}>
            <Box 
              className={styles.contentBox}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3
              }}
            >
              <h2 className={styles.sectionTitle}>
                {regionsError}
              </h2>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRefresh}
                sx={{ minWidth: 200 }}
              >
                Sayfayı Yenile
              </Button>
            </Box>
          </div>
        </div>
      );
    }

    if (!initialRegions) {
      return (
        <div className={`${styles.homeContainer} ${styles.errorContainer}`}>
          <div className={styles.errorContent}>
            <Box 
              className={styles.contentBox}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3
              }}
            >
              <h2 className={styles.sectionTitle}>
                Bölgeler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
              </h2>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRefresh}
                sx={{ minWidth: 200 }}
              >
                Sayfayı Yenile
              </Button>
            </Box>
          </div>
        </div>
      );
    }

    if (initialRegions.length === 0) {
      return (
        <div className={styles.noResults}>
          <h3 className={styles.noResultsTitle}>
            {formatTitle("Henüz bölge bulunmamaktadır")}
          </h3>
        </div>
      );
    }

    return (
      <Box className={styles.regionGridWrapper}>
        <Grid container spacing={3} justifyContent="center">
          {initialRegions.map((region) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={region.id}>
              <div
                className={styles.regionCard}
                onClick={() => handleRegionClick(region)}
              >
                <div className={styles.regionCardBackground}>
                  <Image
                    src={region.thumbnail || 'https://fakeimg.pl/600x400?text=+'}
                    alt={region.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.regionOverlay}>
                  <h3 className={styles.regionName}>
                    {formatRegionTitle(region.name)}
                  </h3>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <>
      {/* Banner Section */}
      <div className={styles.bannerContainer}>
        <CustomSlider banners={initialBanners} />
        <div className={styles.bannerOverlay}>
          <h1 className={styles.bannerTitle}>
            {formatTitle("Golden Castle Travel")}
          </h1>
        </div>
      </div>

      {/* Tours Section */}
      <section className={styles.toursSection}>
        <h2 className={styles.sectionTitle}>
          {formatTitle("Öne Çıkan Turlar")}
        </h2>
        {renderTourContent()}
      </section>

      {/* Regions Section */}
      <section className={styles.regionContainer}>
        <h2 className={styles.regionsTitle}>
          {formatTitle("Yurt Dışı Bölgeler")}
        </h2>
        {renderRegionContent()}
      </section>
    </>
  );
};

export default HomeClient; 