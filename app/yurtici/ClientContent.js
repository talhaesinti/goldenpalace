"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Grid,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { FilterList as FilterListIcon } from "@mui/icons-material";
import CustomSlider from "@/components/Slider/Slider";
import TourCard from "@/components/TourCard";
import Slider from "react-slick";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import styles from "@/styles/pages/DomesticTourPage.module.css";
import { formatTitle } from "@/utils/formatters";
import { fetcher } from "@/utils/fetcher";
import { ErrorUI } from "@/components/ErrorUI";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// SWR Konfigürasyonu
const SWR_CONFIG = {
  revalidateOnMount: true,
  revalidateIfStale: true,
  revalidateOnReconnect: true,
  revalidateOnFocus: false,
  dedupingInterval: 120000, // 2 dakika
};

export function ClientContent({
  initialBanners = [],
  initialTours = [],
  serverError = null,
}) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAirline, setSelectedAirline] = useState("");
  const [priceRange, setPriceRange] = useState(["", ""]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const bannersEndpoint = "/api/banners?type=domestic&is_active=true";
  const toursEndpoint = "/api/domestic-tours?is_active=true";

  // SSR'den gelen hatayı state'e alıyoruz
  const [serverErrorState] = useState(serverError);

  // Client tarafında verilerin başarılı şekilde geldiğini takip etmek için flag
  const [clientFetched, setClientFetched] = useState(false);

  // Persistent hata state’leri
  const [persistentBannersError, setPersistentBannersError] = useState(null);
  const [persistentToursError, setPersistentToursError] = useState(null);

  // -----------------------------------------------------
  // SWR API Çağrıları – fallbackData ile ve onError/onSuccess callback’leriyle
  // -----------------------------------------------------
  const {
    data: bannersData,
    error: bannersError,
    isValidating: bannersValidating,
    mutate: mutateBanners,
  } = useSWR(bannersEndpoint, fetcher, {
    ...SWR_CONFIG,
    fallbackData: initialBanners,
    onError: (err) => setPersistentBannersError(err),
    onSuccess: () => setPersistentBannersError(null),
  });

  const {
    data: toursData,
    error: toursError,
    isValidating: toursValidating,
    mutate: mutateTours,
  } = useSWR(toursEndpoint, fetcher, {
    ...SWR_CONFIG,
    fallbackData: initialTours,
    onError: (err) => setPersistentToursError(err),
    onSuccess: () => setPersistentToursError(null),
  });

  // Verileri Array garantisiyle normalize ediyoruz
  const banners = Array.isArray(bannersData) ? bannersData : [];
  const tours = Array.isArray(toursData) ? toursData : [];

  // Client tarafı veriler geldikten sonra flag'ı true yapıyoruz
  useEffect(() => {
    if (bannersData && toursData && !persistentBannersError && !persistentToursError) {
      setClientFetched(true);
    }
  }, [bannersData, toursData, persistentBannersError, persistentToursError]);

  /**
   * Hata UI gösterim mantığı:
   * - Eğer persistent hatalardan biri varsa her zaman hata UI gösterilir.
   * - Eğer client verileri henüz gelmediyse (clientFetched false) ve SSR hatası varsa hata UI gösterilir.
   */
  const showErrorUI =
    persistentBannersError || persistentToursError || (!clientFetched && serverErrorState);

  const handleRetry = useCallback(() => {
    // Retry butonuna tıklandığında sadece mutate tetikleniyor.
    mutateBanners();
    mutateTours();
  }, [mutateBanners, mutateTours]);

  const handleTourClick = useCallback(
    (tour) => {
      router.push(`/yurtici/${tour.slug}`);
    },
    [router]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [filteredTours, setFilteredTours] = useState(tours || []);

  const handleSearchAndFilter = useCallback(() => {
    try {
      let filtered = tours || [];

      if (searchTerm) {
        filtered = filtered.filter((tour) =>
          tour.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedAirline) {
        filtered = filtered.filter(
          (tour) => tour.airline.toLowerCase() === selectedAirline.toLowerCase()
        );
      }

      if (priceRange[0]) {
        filtered = filtered.filter((tour) => {
          const price = parseFloat(tour.price);
          return price >= parseFloat(priceRange[0]);
        });
      }
      if (priceRange[1]) {
        filtered = filtered.filter((tour) => {
          const price = parseFloat(tour.price);
          return price <= parseFloat(priceRange[1]);
        });
      }

      if (startDate) {
        filtered = filtered.filter(
          (tour) => new Date(tour.start_date) >= new Date(startDate)
        );
      }
      if (endDate) {
        filtered = filtered.filter(
          (tour) => new Date(tour.end_date) <= new Date(endDate)
        );
      }

      setFilteredTours(filtered);
    } catch (error) {
      console.error("Filtreleme hatası:", error);
    }
  }, [searchTerm, selectedAirline, priceRange, startDate, endDate, tours]);

  useEffect(() => {
    handleSearchAndFilter();
  }, [handleSearchAndFilter]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedAirline("");
    setPriceRange(["", ""]);
    setStartDate("");
    setEndDate("");
  };

  const airlineOptions = Array.from(
    new Set((tours || []).map((tour) => tour.airline).filter(Boolean))
  );

  const sliderSettings = {
    dots: true,
    infinite: filteredTours.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      {/* Banner Section */}
      <div className={styles.bannerContainer}>
        <CustomSlider banners={banners} />
        <div className={styles.bannerOverlay}>
          <h1 className={styles.bannerTitle}>
            {formatTitle("Yurt İçi Turlar")}
          </h1>
        </div>
      </div>

      {/* Hata UI: Hata yalnızca veri eksikse gösterilsin */}
      {showErrorUI ? (
        <Box sx={{ width: "100%", marginTop: 2 }}>
          <h2 className={styles.sectionTitle}>
            {formatTitle("Turlar")}
          </h2>
          <ErrorUI
            title="Bağlantı Hatası"
            message="Veriler güncellenirken bir hata oluştu."
            onRetry={handleRetry}
          />
        </Box>
      ) : (
        <div className={styles.homeContainer}>
          <h2 className={styles.sectionTitle}>
            {formatTitle("Turlar")}
          </h2>

          {/* Filter Section */}
          {isMobile ? (
            <>
              <Box
                textAlign="right"
                sx={{ position: "relative", zIndex: 1100, mb: 1 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                >
                  Filtrele
                </Button>
              </Box>
              {isFilterExpanded && (
                <Box className="mobileFilterOverlay">
                  <Box className={styles.mobileFilterBox}>
                    <Grid container spacing={2} className={styles.filterGrid}>
                      <Grid item xs={12}>
                        <TextField
                          label="Tur Ara"
                          variant="outlined"
                          fullWidth
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="airline-label">Havayolu</InputLabel>
                          <Select
                            labelId="airline-label"
                            label="Havayolu"
                            value={selectedAirline}
                            onChange={(e) =>
                              setSelectedAirline(e.target.value)
                            }
                          >
                            <MenuItem value="">
                              <em>Hepsi</em>
                            </MenuItem>
                            {airlineOptions.map((airline, index) => (
                              <MenuItem key={index} value={airline}>
                                {airline}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="En Düşük Fiyat"
                          variant="outlined"
                          type="number"
                          fullWidth
                          value={priceRange[0]}
                          onChange={(e) =>
                            setPriceRange([e.target.value, priceRange[1]])
                          }
                          placeholder="En Düşük Fiyat"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="En Yüksek Fiyat"
                          variant="outlined"
                          type="number"
                          fullWidth
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([priceRange[0], e.target.value])
                          }
                          placeholder="En Yüksek Fiyat"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Başlangıç Tarihi"
                          variant="outlined"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Bitiş Tarihi"
                          variant="outlined"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ textAlign: "right" }}>
                        <Button variant="outlined" onClick={resetFilters}>
                          Filtreleri Sıfırla
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => setIsFilterExpanded(false)}
                          sx={{ ml: 1 }}
                        >
                          Kapat
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}
            </>
          ) : (
            <Grid
              container
              spacing={2}
              className={styles.filterGrid}
              justifyContent="center"
            >
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Tur Ara"
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="airline-label">Havayolu</InputLabel>
                  <Select
                    labelId="airline-label"
                    label="Havayolu"
                    value={selectedAirline}
                    onChange={(e) => setSelectedAirline(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Hepsi</em>
                    </MenuItem>
                    {airlineOptions.map((airline, index) => (
                      <MenuItem key={index} value={airline}>
                        {airline}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="En Düşük Fiyat"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([e.target.value, priceRange[1]])
                  }
                  placeholder="En Düşük Fiyat"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="En Yüksek Fiyat"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], e.target.value])
                  }
                  placeholder="En Yüksek Fiyat"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Başlangıç Tarihi"
                  variant="outlined"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Bitiş Tarihi"
                  variant="outlined"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} style={{ textAlign: "right" }}>
                <Button variant="outlined" onClick={resetFilters}>
                  Filtreleri Sıfırla
                </Button>
              </Grid>
            </Grid>
          )}

          {/* Tours Section */}
          <section className={styles.toursSection}>
            {filteredTours.length === 0 ? (
              <div className={styles.noResults}>
                <h3 className={styles.noResultsTitle}>
                  {formatTitle("Arama kriterlerinize uygun tur bulunamadı")}
                </h3>
              </div>
            ) : isMobile ? (
              <div className={styles.mobileSliderContainer}>
                <Slider {...sliderSettings}>
                  {filteredTours.map((tour) => (
                    <div key={tour.id} className={styles.tourCardWrapper}>
                      <TourCard
                        tour={{ ...tour, name: formatTitle(tour.name) }}
                        onClick={() => handleTourClick(tour)}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <div className={styles.toursGrid}>
                {filteredTours.map((tour) => (
                  <div key={tour.id} className={styles.tourCardWrapper}>
                    <TourCard
                      tour={{ ...tour, name: formatTitle(tour.name) }}
                      onClick={() => handleTourClick(tour)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
