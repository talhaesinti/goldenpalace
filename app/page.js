"use client";

import React, { useEffect, useState } from "react";
import CustomSlider from "../components/Slider/Slider";
import TourCard from "../components/TourCard";
import Slider from "react-slick";
import {
  Grid,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import internationalToursAPI from "./api/internationalToursAPI";
import bannersAPI from "./api/bannersAPI";
import regionsAPI from "./api/regionsAPI";
import { useRouter } from "next/navigation";
import { formatTitle, formatRegionTitle } from "@/utils/formatters";
import styles from "../styles/pages/HomePage.module.css";

const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [state, setState] = useState({
    tours: {
      data: [],
      loading: true,
      error: null
    },
    regions: {
      data: [],
      loading: true,
      error: null
    }
  });
  
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const fetchBanners = async () => {
      try {
        const response = await bannersAPI.getBanners({ type: "home", is_active: "true" });
        if (isSubscribed) {
          setBanners(response.data);
        }
      } catch (error) {
        console.error("Banner yüklenirken hata:", error);
      }
    };

    const fetchTours = async () => {
      try {
        const response = await internationalToursAPI.getInternationalTours({ is_active: true });
        if (isSubscribed) {
          setState(prev => ({
            ...prev,
            tours: {
              data: response.data.slice(0, 8),
              loading: false,
              error: null
            }
          }));
        }
      } catch (error) {
        if (isSubscribed) {
          setState(prev => ({
            ...prev,
            tours: {
              ...prev.tours,
              loading: false,
              error: "Turlar yüklenirken bir hata oluştu"
            }
          }));
        }
      }
    };

    const fetchRegions = async () => {
      try {
        const response = await regionsAPI.getRegions({ is_active: true });
        if (isSubscribed) {
          setState(prev => ({
            ...prev,
            regions: {
              data: response.data,
              loading: false,
              error: null
            }
          }));
        }
      } catch (error) {
        if (isSubscribed) {
          setState(prev => ({
            ...prev,
            regions: {
              ...prev.regions,
              loading: false,
              error: "Bölgeler yüklenirken bir hata oluştu"
            }
          }));
        }
      }
    };

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Tüm fetch işlemlerini paralel başlat
    fetchBanners();
    fetchTours();
    fetchRegions();

    return () => {
      isSubscribed = false;
      window.removeEventListener("resize", handleResize);
    };
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

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: state.tours.data.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  return (
    <>
      {/* Banner Section */}
      <div className={styles.bannerContainer}>
        <CustomSlider banners={banners} />
      </div>


      {/* Tours Section */}
      <section className={styles.toursSection}>
        <h2 className={styles.sectionTitle}>
          {formatTitle("Öne Çıkan Turlar")}
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
              {formatTitle("Henüz tur bulunmamaktadır")}
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

      {/* Regions Section */}
      <section className={styles.regionContainer}>
        <h2 className={styles.regionsTitle}>
          {formatTitle("Yurt Dışı Bölgeler")}
        </h2>
        
        {state.regions.loading ? (
          <Box className={styles.componentLoading}>
            <CircularProgress size={40} />
          </Box>
        ) : state.regions.error ? (
          <Box className={styles.componentError}>
            <Alert severity="error">{state.regions.error}</Alert>
          </Box>
        ) : state.regions.data.length === 0 ? (
          <div className={styles.noResults}>
            <h3 className={styles.noResultsTitle}>
              {formatTitle("Henüz bölge bulunmamaktadır")}
            </h3>
          </div>
        ) : (
          <Box className={styles.regionGridWrapper}>
            <Grid container spacing={3} justifyContent="center">
              {state.regions.data.map((region) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={region.id}>
                  <div
                    className={styles.regionCard}
                    onClick={() => handleRegionClick(region)}
                  >
                    <div
                      className={styles.regionCardBackground}
                      style={{ backgroundImage: `url(${region.thumbnail})` }}
                    />
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
        )}
      </section>
    </>
  );
};

export default HomePage;
