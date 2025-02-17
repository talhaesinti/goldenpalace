'use client';

import React, { useEffect, useCallback, useState } from "react";
import { Grid, Box, Button } from "@mui/material";
import CustomSlider from "../components/Slider/Slider";
import TourCard from "../components/TourCard";
import Slider from "react-slick";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { formatTitle, formatRegionTitle } from "@/utils/formatters";
import { fetcher } from "@/utils/fetcher";
import { ErrorUI } from "@/components/ErrorUI";
import styles from "../styles/pages/HomePage.module.css";

// SWR Konfigürasyonu
const SWR_CONFIG = {
  revalidateOnMount: true,
  revalidateIfStale: true,
  revalidateOnReconnect: true,
  revalidateOnFocus: false,
  dedupingInterval: 120000, // 2 dakika
};

const HomeClientContent = ({
  initialBanners = [],
  initialTours = [],
  initialRegions = [],
  toursError,      // SSR'den gelen turlar hatası
  regionsError,    // SSR'den gelen bölgeler hatası
  serverError,     // Global server error (HomeError üzerinden)
}) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // API endpoint’leri
  const bannersEndpoint = "/api/banners?type=home&is_active=true";
  const toursEndpoint = "/api/international-tours?is_active=true";
  const regionsEndpoint = "/api/regions?is_active=true";

  // SWR API çağrıları
  const { data: bannersData, error: bannersSWRerror } = useSWR(bannersEndpoint, fetcher, {
    ...SWR_CONFIG,
    fallbackData: initialBanners,
  });
  const { data: toursData, error: toursSWRerror } = useSWR(toursEndpoint, fetcher, {
    ...SWR_CONFIG,
    fallbackData: initialTours,
  });
  const { data: regionsData, error: regionsSWRerror } = useSWR(regionsEndpoint, fetcher, {
    ...SWR_CONFIG,
    fallbackData: initialRegions,
  });

  // Etkili hata kontrolü: SWR'den gelen hata ile SSR'den gelen hataları birleştiriyoruz.
  const effectiveToursError = toursSWRerror || toursError;
  const effectiveRegionsError = regionsSWRerror || regionsError;
  // Banner için hata yönetimini sadeleştiriyoruz: Banner boşsa bile hata sayılmayacak.

  // Verileri normalize edelim: Her zaman dizi olarak.
  const banners = Array.isArray(bannersData) ? bannersData : [];
  const tours = Array.isArray(toursData) ? toursData : [];
  const regions = Array.isArray(regionsData) ? regionsData : [];

  // Global server error kontrolü:
  // Eğer serverError varsa VE SWR verilerinden herhangi biri eksikse, hata UI gösterilsin.
  const shouldShowServerError =
    serverError && serverError.message && (!bannersData || !toursData || !regionsData);

  // Global retry fonksiyonu
  const handleRetry = useCallback(() => {
    mutate(bannersEndpoint);
    mutate(toursEndpoint);
    mutate(regionsEndpoint);
  }, [bannersEndpoint, toursEndpoint, regionsEndpoint]);

  if (shouldShowServerError) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <h2 className={styles.sectionTitle}>{formatTitle("Hata")}</h2>
        <p>{serverError.message}</p>
        <Button variant="contained" color="primary" onClick={handleRetry}>
          Sayfayı Yenile
        </Button>
      </Box>
    );
  }

  // --- Banner Bölümü ---
  // Banner verisi boşsa da, CustomSlider'a boş array gönderilir. (CustomSlider kendi "no result" mesajını gösterebilir.)
  const renderBannerSection = () => (
    <div className={styles.bannerContainer}>
      <CustomSlider banners={banners} />
    </div>
  );

  // --- Turlar Bölümü ---
  const renderTourContent = () => {
    if (effectiveToursError) {
      return (
        <Box sx={{ width: "100%", mt: 2 }}>
          <ErrorUI
            title={formatTitle("Öne Çıkan Turlar Hatası")}
            message="Turlar güncellenirken bir hata oluştu."
            onRetry={handleRetry}
          />
        </Box>
      );
    }
    if (!tours || tours.length === 0) {
      return (
        <Box className={styles.noResults}>
          <h3 className={styles.noResultsTitle}>
            {formatTitle("Henüz tur bulunmamaktadır")}
          </h3>
          <p className={styles.noResultsText}>
            {formatTitle("Çok yakında yeni turlar eklenecektir")}
          </p>
        </Box>
      );
    }
    const sliderSettings = {
      dots: true,
      infinite: tours.length > 1,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: true,
    };
    return (
      <>
        {isMobile ? (
          <div className={styles.mobileSliderContainer}>
            <Slider {...sliderSettings}>
              {tours.map((tour) => (
                <div key={tour.id} className={styles.tourCardWrapper}>
                  <div onClick={() => router.push(`/yurtici/${tour.slug}`)}>
                    <TourCard tour={{ ...tour, name: formatTitle(tour.name) }} />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <div className={styles.toursGrid}>
            {tours.map((tour) => (
              <div
                key={tour.id}
                className={styles.tourCardWrapper}
                onClick={() => router.push(`/yurtici/${tour.slug}`)}
              >
                <TourCard tour={{ ...tour, name: formatTitle(tour.name) }} />
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  // --- Bölgeler Bölümü ---
  const renderRegionContent = () => {
    if (effectiveRegionsError) {
      return (
        <Box sx={{ width: "100%", mt: 2 }}>
          <ErrorUI
            title={formatTitle("Bölgeler Hatası")}
            message="Bölgeler güncellenirken bir hata oluştu."
            onRetry={handleRetry}
          />
        </Box>
      );
    }
    if (!regions || regions.length === 0) {
      return (
        <Box className={styles.noResults}>
          <h3 className={styles.noResultsTitle}>
            {formatTitle("Henüz bölge bulunmamaktadır")}
          </h3>
          <p className={styles.noResultsText}>
            {formatTitle("Çok yakında yeni bölgeler eklenecektir")}
          </p>
        </Box>
      );
    }
    return (
      <>
        <h2 className={styles.sectionTitle}>{formatTitle("Bölgeler")}</h2>
        <Grid container spacing={3} className={styles.gridContainer} justifyContent="center">
          {regions.map((region) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={region?.id}>
              <div
                className={styles.regionCard}
                onClick={() => region?.slug && router.push(`/yurtdisi/${region.slug}`)}
              >
                <div className={styles.regionCardBackground}>
                  <Image
                    src={region?.thumbnail || "https://fakeimg.pl/600x400?text=+"}
                    alt={region?.name || "Bölge"}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.regionOverlay}>
                  <h3 className={styles.regionName}>
                    {formatRegionTitle(region?.name || "")}
                  </h3>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  return (
    <div>
      {renderBannerSection()}
      <div className={styles.homeContainer}>
        <section className={styles.toursSection}>
          <h2 className={styles.sectionTitle}>{formatTitle("Öne Çıkan Turlar")}</h2>
          {renderTourContent()}
        </section>
        <section className={styles.regionContainer}>
          <h2 className={styles.sectionTitle}>{formatTitle("Yurt Dışı Bölgeler")}</h2>
          {renderRegionContent()}
        </section>
      </div>
    </div>
  );
};

export default HomeClientContent;
