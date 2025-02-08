'use client';

import React, { useEffect, useState, useCallback } from "react";
import CustomSlider from "@/components/Slider/Slider";
import TourCard from "@/components/TourCard";
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
} from "@mui/material";
import { FilterList as FilterListIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "@/styles/pages/RegionDetailPage.module.css";
import { formatTitle, formatRegionTitle } from "@/utils/formatters";

const RegionDetailClient = ({ initialRegion, initialTours, error }) => {
  const router = useRouter();
  const [banners, setBanners] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAirline, setSelectedAirline] = useState("");
  const [priceRange, setPriceRange] = useState(["", ""]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredTours, setFilteredTours] = useState(initialTours);

  const handleTourClick = useCallback((tour) => {
    const tourSlug = tour.slug;
    const regionSlug = initialRegion?.slug;
    router.push(`/yurtdisi/${regionSlug}/${tourSlug}`);
  }, [router, initialRegion?.slug]);

  const handleSearchAndFilter = useCallback(() => {
    let filtered = initialTours;

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
  }, [searchTerm, selectedAirline, priceRange, startDate, endDate, initialTours]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    
    if (initialRegion?.thumbnail) {
      setBanners([{ image: initialRegion.thumbnail }]);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [initialRegion?.thumbnail]);

  useEffect(() => {
    handleSearchAndFilter();
  }, [handleSearchAndFilter]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedAirline("");
    setPriceRange(["", ""]);
    setStartDate("");
    setEndDate("");
  };

  const airlineOptions = Array.from(
    new Set(initialTours.map((tour) => tour.airline).filter(Boolean))
  );

  const sliderSettings = {
    dots: true,
    infinite: banners.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (error) {
    return (
      <>
        <div className={styles.bannerContainer}>
          <CustomSlider banners={[]} />
          <div className={styles.bannerBackground} />
          <div className={styles.bannerOverlay}>
            <div className={styles.overlayContent}>
              <h1 className={styles.bannerTitle}>
                Bölge Bulunamadı
              </h1>
            </div>
          </div>
        </div>

        <div className={`${styles.contentContainer} ${styles.errorContainer}`}>
          <div className={styles.errorContent}>
            <Box className={styles.contentBox}>
              <h2 className={styles.sectionTitle}>
                {error}
              </h2>
              <Button
                variant="contained"
                color="primary"
                href="/yurtdisi"
                sx={{ mt: 2 }}
              >
                Tüm Bölgeleri Görüntüle
              </Button>
            </Box>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.bannerContainer}>
        <CustomSlider banners={banners} />
        <div className={styles.bannerOverlay}>
          <h1 className={styles.bannerTitle}>
            {formatRegionTitle(initialRegion?.name)}
          </h1>
        </div>
      </div>

      <div className={styles.homeContainer}>
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
                    <MenuItem value=""><em>Hepsi</em></MenuItem>
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
                          <MenuItem value=""><em>Hepsi</em></MenuItem>
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
                        onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
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
                        onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
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

        <section className={styles.toursSection}>
          {filteredTours.length === 0 ? (
            <div className={styles.noResults}>
              <h3 className={styles.noResultsTitle}>
                {formatTitle("Arama kriterlerinize uygun tur bulunamadı")}
              </h3>
              <p className={styles.noResultsText}>
                {formatTitle("Lütfen farklı kriterler ile arama yapınız")}
              </p>
            </div>
          ) : isMobile ? (
            <div className={styles.mobileSliderContainer}>
              <Slider {...sliderSettings}>
                {filteredTours.map((tour) => (
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
              {filteredTours.map((tour) => (
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

export default RegionDetailClient; 