"use client";

import React, { useEffect, useState } from "react";
import CustomSlider from "../../components/Slider/Slider";
import { Grid, Typography, Box, CircularProgress, Alert } from "@mui/material";
import bannersAPI from "../api/bannersAPI";
import regionsAPI from "../api/regionsAPI";
import styles from "../../styles/pages/InternationalTourPage.module.css";
import { useRouter } from "next/navigation";
import { formatTitle, formatRegionTitle } from "@/utils/formatters";

const InternationalTourPage = () => {
  const [banners, setBanners] = useState([]);
  const [state, setState] = useState({
    regions: {
      data: [],
      loading: true,
      error: null
    }
  });
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      try {
        const [bannersResponse, regionsResponse] = await Promise.all([
          bannersAPI.getBanners({
            type: "international",
            is_active: "true",
          }),
          regionsAPI.getRegions({
            is_active: true,
          })
        ]);

        if (!isSubscribed) return;

        setBanners(bannersResponse.data);
        setState(prev => ({
          ...prev,
          regions: {
            data: regionsResponse.data,
            loading: false,
            error: null
          }
        }));
      } catch (error) {
        console.error("Veri yüklenirken hata oluştu:", error);
        if (isSubscribed) {
          setState(prev => ({
            ...prev,
            regions: {
              ...prev.regions,
              loading: false,
              error: "Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin."
            }
          }));
        }
      }
    };

    fetchData();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleRegionClick = (region) => {
    const regionUrl = `/yurtdisi/${region.slug}`;
    router.push(regionUrl);
  };

  return (
    <div>
      <div className={styles.bannerContainer}>
        <CustomSlider banners={banners} />
        <div className={styles.bannerOverlay}>
          <h1 className={styles.bannerTitle}>
            {formatTitle("Yurt Dışı Turlar")}
          </h1>
        </div>
      </div>

      <div className={styles.homeContainer}>
        <h2 className={styles.sectionTitle}>
          {formatTitle("Bölgeler")}
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
          <Box className={styles.noResults}>
            <h3 className={styles.noResultsTitle}>
              {formatTitle("Henüz bölge bulunmamaktadır")}
            </h3>
            <p className={styles.noResultsText}>
              {formatTitle("Çok yakında yeni bölgeler eklenecektir")}
            </p>
          </Box>
        ) : (
          <Grid container spacing={3} className={styles.gridContainer} justifyContent="center">
            {state.regions.data.map((region) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={region.id}>
                <Box
                  className={styles.regionCard}
                  onClick={() => handleRegionClick(region)}
                >
                  <Box
                    className={styles.regionCardBackground}
                    style={{ backgroundImage: `url(${region.thumbnail})` }}
                  />
                  <Box className={styles.regionOverlay}>
                    <h3 className={styles.regionName}>
                      {formatRegionTitle(region.name)}
                    </h3>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </div>
  );
};

export default InternationalTourPage;
