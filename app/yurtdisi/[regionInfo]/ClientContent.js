"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
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
import styles from "@/styles/pages/RegionDetailPage.module.css";
import { formatTitle } from "@/utils/formatters";
import { fetcher } from "@/utils/fetcher";
import { ErrorUI } from "@/components/ErrorUI";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SWR_CONFIG = {
  revalidateOnMount: true,
  revalidateIfStale: true,
  revalidateOnReconnect: true,
  revalidateOnFocus: false,
  dedupingInterval: 120000, // 2 dakika
};

export function ClientContent({
  initialRegion,
  initialTours = [],
  serverError = null,
}) {
  const router = useRouter();

  // Responsive & filtreleme
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAirline, setSelectedAirline] = useState("");
  const [priceRange, setPriceRange] = useState(["", ""]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredTours, setFilteredTours] = useState(initialTours);

  // Client verisi geldi mi?
  const [clientFetched, setClientFetched] = useState(false);

  // Endpoint'ler (SSR fallback için initialRegion kullanılıyor)
  const regionEndpoint = initialRegion
    ? `/api/regions/${initialRegion.slug}`
    : null;
  const toursEndpoint = initialRegion
    ? `/api/international-tours?region_slug=${initialRegion.slug}&is_active=true`
    : null;

  // Persistent hata state'leri
  const [persistentRegionError, setPersistentRegionError] = useState(null);
  const [persistentToursError, setPersistentToursError] = useState(null);
  const [serverErrorState] = useState(serverError);

  // SWR ile veri çekimi (her SWR çağrısı kendi mutate fonksiyonunu döndürür)
  const {
    data: region,
    mutate: mutateRegion,
    error: regionError,
  } = useSWR(regionEndpoint, fetcher, {
    ...SWR_CONFIG,
    fallbackData: initialRegion,
    onError: (err) => setPersistentRegionError(err),
    onSuccess: () => setPersistentRegionError(null),
  });

  const {
    data: tours,
    mutate: mutateTours,
    error: toursError,
  } = useSWR(toursEndpoint, fetcher, {
    ...SWR_CONFIG,
    fallbackData: initialTours,
    onError: (err) => setPersistentToursError(err),
    onSuccess: () => setPersistentToursError(null),
  });

  // Normalize
  const normalizedRegion = region || initialRegion;
  const normalizedTours = Array.isArray(tours) ? tours : initialTours;

  // Region aktiflik kontrolü
  const regionNotFound = !normalizedRegion;
  const regionInactive = normalizedRegion && !normalizedRegion.is_active;

  // clientFetched kontrolü
  useEffect(() => {
    if (
      normalizedRegion &&
      normalizedTours &&
      !persistentRegionError &&
      !persistentToursError
    ) {
      setClientFetched(true);
    }
  }, [normalizedRegion, normalizedTours, persistentRegionError, persistentToursError]);

  // showErrorUI
  const showErrorUI =
    (!clientFetched && serverErrorState) ||
    persistentRegionError ||
    persistentToursError ||
    regionNotFound ||
    regionInactive;

  // Hata mesajı
  let errorMessage = "";
  if (!clientFetched && serverErrorState) {
    errorMessage =
      typeof serverErrorState === "string"
        ? serverErrorState
        : serverErrorState.message || "API hatası";
  } else if (persistentRegionError) {
    errorMessage = persistentRegionError.message || "Böyle bir bölge bulunamadı.";
  } else if (regionInactive) {
    errorMessage = "Bu bölge aktif değildir. Lütfen başka bir bölge seçiniz.";
  } else if (regionNotFound) {
    errorMessage =
      "Böyle bir bölge bulunmamaktadır. Lütfen diğer bölgelerimizi inceleyin.";
  } else if (persistentToursError) {
    errorMessage = persistentToursError.message || "Tur verileri alınamadı.";
  }

  // Retry (Tekrar Dene)
  const handleRetry = useCallback(() => {
    // Region ve tours verilerini revalidate etmek için her SWR'in kendi mutate'ini çağırıyoruz
    mutateRegion(undefined, { revalidate: true });
    mutateTours(undefined, { revalidate: true });
  }, [mutateRegion, mutateTours]);

  // Tour kartı tıklama fonksiyonu
  const handleTourClick = useCallback(
    (tour) => {
      router.push(`/yurtdisi/${normalizedRegion?.slug || initialRegion?.slug}/${tour.slug}`);
    },
    [router, normalizedRegion, initialRegion]
  );

  // Sayfa açılışında smooth scroll
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filtreleme işlemleri
  const handleSearchAndFilter = useCallback(() => {
    try {
      let filtered = tours || initialTours;

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
  }, [searchTerm, selectedAirline, priceRange, startDate, endDate, tours, initialTours]);

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
    new Set((tours || initialTours).map((tour) => tour.airline).filter(Boolean))
  );

  const sliderSettings = {
    dots: true,
    infinite: filteredTours.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      {/* Banner Section */}
      <div className={styles.bannerContainer}>
        <CustomSlider
          banners={[
            { image: normalizedRegion?.thumbnail || initialRegion?.thumbnail },
          ]}
        />
        <div className={styles.bannerOverlay}>
          <h1 className={styles.bannerTitle}>
            {formatTitle(normalizedRegion?.name || initialRegion?.name || "Bölge")}
          </h1>
        </div>
      </div>

      {/* Hata UI */}
      {showErrorUI ? (
        <Box sx={{ width: "100%", marginTop: 2 }}>
          <h2 className={styles.sectionTitle}>{formatTitle("Turlar")}</h2>
          <ErrorUI
            title={
              regionNotFound || persistentRegionError
                ? "Bölge Bulunamadı"
                : regionInactive
                ? "Bölge Aktif Değil"
                : "Bağlantı Hatası"
            }
            message={errorMessage}
            onRetry={handleRetry}
          />
        </Box>
      ) : (
        <div className={styles.homeContainer}>
          {/* Başlık Bölümü: Artık en üstte */}
          <h2 className={styles.sectionTitle}>
            {formatTitle(
              `${normalizedRegion?.name || initialRegion?.name || "Bölge"} Turları`
            )}
          </h2>

          {/* Filter Section */}
          <Box className={styles.filterContainer}>
            {!isMobile ? (
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
            ) : (
              <>
                <Box
                  textAlign="right"
                  sx={{ position: "relative", zIndex: 1098, mb: 1 }}
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
                      <Grid container spacing={2}>
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
            )}
          </Box>

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
                  <div
                    key={tour.id}
                    className={styles.tourCardWrapper}
                    onClick={() => handleTourClick(tour)}
                  >
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

export default ClientContent;
