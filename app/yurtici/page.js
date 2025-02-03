"use client"; // Next.js'de client-side rendering için gerekli

import React, { useEffect, useState } from "react";
import CustomSlider from "../../components/Slider/Slider";
import TourCard from "../../components/TourCard";
import Slider from "react-slick";
import {
  Grid,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Collapse,
  CircularProgress,
  Alert,
} from "@mui/material";
import { FilterList as FilterListIcon } from "@mui/icons-material";
import domesticToursAPI from "../api/domesticToursAPI";
import bannersAPI from "../api/bannersAPI";
import { useRouter } from "next/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../../styles/pages/DomesticTourPage.module.css"; // Sayfa bazlı stil dosyasını dahil edin
import { formatTitle } from "@/utils/formatters";

const DomesticTourPage = () => {
  const [banners, setBanners] = useState([]);
  const [state, setState] = useState({
    tours: {
      data: [],
      loading: true,
      error: null
    }
  });
  const [isMobile, setIsMobile] = useState(false);
  
  // Filtreleme state'leri
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAirline, setSelectedAirline] = useState("");
  const [priceRange, setPriceRange] = useState(["", ""]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      try {
        const [toursResponse, bannersResponse] = await Promise.all([
          domesticToursAPI.getDomesticTours({ is_active: true }),
          bannersAPI.getBanners({ type: "domestic", is_active: "true" })
        ]);

        if (!isSubscribed) return;

        setBanners(bannersResponse.data);
        setState(prev => ({
          ...prev,
          tours: {
            data: toursResponse.data,
            loading: false,
            error: null
          }
        }));
      } catch (error) {
        console.error("Veri yüklenirken hata oluştu:", error);
        if (isSubscribed) {
          setState(prev => ({
            ...prev,
            tours: {
              ...prev.tours,
              loading: false,
              error: "Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin."
            }
          }));
        }
      }
    };

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    fetchData();

    return () => {
      isSubscribed = false;
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Slider ayarları
  const sliderSettings = {
    dots: true,
    infinite: state.tours.data.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Arama ve filtreleme fonksiyonu
  const handleSearchAndFilter = () => {
    let filtered = state.tours.data;

    // Arama terimi ile filtreleme
    if (searchTerm) {
      filtered = filtered.filter((tour) =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Havayolu ile filtreleme
    if (selectedAirline) {
      filtered = filtered.filter(
        (tour) => tour.airline.toLowerCase() === selectedAirline.toLowerCase()
      );
    }

    // Fiyat aralığı ile filtreleme
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

    // Tarih aralığı ile filtreleme
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

    setState(prev => ({
      ...prev,
      tours: {
        ...prev.tours,
        data: filtered
      }
    }));
  };

  // Her filtreleme kriteri değiştiğinde filtreleme fonksiyonunu çağır
  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, selectedAirline, priceRange, startDate, endDate, state.tours.data]);

  // Mevcut havayolu seçeneklerini belirlemek için
  const airlineOptions = Array.from(new Set(state.tours.data.map((tour) => tour.airline)));

  // Filtreleri sıfırlama fonksiyonu
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedAirline("");
    setPriceRange(["", ""]);
    setStartDate("");
    setEndDate("");
  };

  const handleTourClick = (tour) => {
    router.push(`/yurtici/${tour.slug}`);
  };

  return (
    <>
      {/* Banner Section */}
      <div className={styles.bannerContainer}>
        <CustomSlider banners={banners} />
        <div className={styles.bannerOverlay}>
          <h1 className={styles.bannerTitle}>
            {formatTitle("Yurt İçi Turlar")}
          </h1>
        </div>
      </div>
      
      <div className={styles.homeContainer}>
        {/* Filter Section - Always show regardless of loading state */}
        <Box className={styles.filterContainer}>
          {!isMobile ? (
            // Masaüstünde filtreler görünür
            <Grid
              container
              spacing={2}
              className={styles.filterGrid}
              justifyContent="center"
            >
              {/* İlk Satır */}
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
                  onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
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
                  onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                  placeholder="En Yüksek Fiyat"
                />
              </Grid>

              {/* İkinci Satır */}
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

              {/* Filtreleri Sıfırla Butonu */}
              <Grid item xs={12} style={{ textAlign: "right" }}>
                <Button variant="outlined" onClick={resetFilters}>
                  Filtreleri Sıfırla
                </Button>
              </Grid>
            </Grid>
          ) : (
            // Mobilde filtre butonu ve açılır filtreler
            <>
              <Box textAlign="right">
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                >
                  Filtrele
                </Button>
              </Box>
              <Collapse in={isFilterExpanded}>
                <Box className={styles.mobileFilterBox}>
                  <Grid
                    container
                    spacing={2}
                    className={styles.filterGrid}
                    justifyContent="center"
                  >
                    {/* Filtreleme Alanları */}
                    <Grid item xs={12}>
                      <TextField
                        label="Tur Ara"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ marginBottom: "16px" }}
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
                        placeholder="En Düşük Fiyat"
                        style={{ marginBottom: "16px" }}
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
                        style={{ marginBottom: "16px" }}
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
                        style={{ marginBottom: "16px" }}
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
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    {/* Filtreleri Sıfırla Butonu */}
                    <Grid item xs={12} style={{ textAlign: "right" }}>
                      <Button variant="outlined" onClick={resetFilters}>
                        Filtreleri Sıfırla
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </>
          )}
        </Box>

        {/* Tours Section */}
        <section className={styles.toursSection}>
          <h2 className={styles.sectionTitle}>
            {formatTitle("Yurt İçi Turlar")}
          </h2>
          
          {state.tours.loading ? (
            <Box className={styles.componentLoading}>
              <CircularProgress size={40} />
            </Box>
          ) : state.tours.error ? (
            <Box className={styles.componentError}>
              <Alert severity="error">{state.tours.error}</Alert>
            </Box>
          ) : state.tours.data.length === 0 ? (
            <div className={styles.noResults}>
              <h3 className={styles.noResultsTitle}>
                {formatTitle("Arama kriterlerinize uygun tur bulunamadı")}
              </h3>
            </div>
          ) : isMobile ? (
            <div className={styles.mobileSliderContainer}>
              <Slider {...sliderSettings}>
                {state.tours.data.map((tour) => (
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
              {state.tours.data.map((tour) => (
                <div
                  key={tour.id}
                  className={styles.tourCardWrapper}
                  onClick={() => handleTourClick(tour)}
                >
                  <TourCard tour={{...tour, name: formatTitle(tour.name)}} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default DomesticTourPage;
