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
  ButtonGroup,
} from "@mui/material";
import { FilterList as FilterListIcon, Refresh } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "@/styles/pages/DomesticTourPage.module.css";
import { formatTitle } from "@/utils/formatters";

const DomesticTourClient = ({ initialBanners = [], initialTours = [], error }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAirline, setSelectedAirline] = useState("");
  const [priceRange, setPriceRange] = useState(["", ""]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredTours, setFilteredTours] = useState(initialTours);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const handleTourClick = useCallback((tour) => {
    router.push(`/yurtici/${tour.slug}`);
  }, [router]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    infinite: filteredTours.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (error) {
    return (
      <>
        <div className={styles.bannerContainer}>
          <CustomSlider banners={[]} />
          <div className={styles.bannerOverlay}>
            <h1 className={styles.bannerTitle}>
              {formatTitle("Yurt İçi Turlar")}
            </h1>
          </div>
        </div>

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
                {error}
              </h2>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRefresh}
                startIcon={<Refresh />}
                sx={{ minWidth: 200 }}
              >
                Sayfayı Yenile
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
        <CustomSlider banners={initialBanners} />
        <div className={styles.bannerOverlay}>
          <h1 className={styles.bannerTitle}>
            {formatTitle("Yurt İçi Turlar")}
          </h1>
        </div>
      </div>

      <div className={styles.homeContainer}>
        <Box className={styles.filterContainer}>
          {!isMobile ? (
            <Grid container spacing={2} className={styles.filterGrid} justifyContent="center">
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
                  <Grid container spacing={2} className={styles.filterGrid} justifyContent="center">
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
          <h2 className={styles.sectionTitle}>
            {formatTitle("Yurt İçi Turlar")}
          </h2>

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

export default DomesticTourClient; 