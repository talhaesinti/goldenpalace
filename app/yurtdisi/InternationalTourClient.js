'use client';

import React, { useEffect } from "react";
import CustomSlider from "@/components/Slider/Slider";
import { Grid, Box, ButtonGroup, Button } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import Image from 'next/image';
import styles from "@/styles/pages/InternationalTourPage.module.css";
import { useRouter } from "next/navigation";
import { formatTitle, formatRegionTitle } from "@/utils/formatters";

const InternationalTourClient = ({ initialBanners = [], initialRegions = [], error }) => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <>
        <div className={styles.bannerContainer}>
          <CustomSlider banners={[]} />
          <div className={styles.bannerOverlay}>
            <h1 className={styles.bannerTitle}>
              {formatTitle("Yurt Dışı Turlar")}
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

  const handleRegionClick = (region) => {
    const regionUrl = `/yurtdisi/${region.slug}`;
    router.push(regionUrl);
  };

  return (
    <div>
      <div className={styles.bannerContainer}>
        <CustomSlider banners={initialBanners} />
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

        {initialRegions.length === 0 ? (
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
        )}
      </div>
    </div>
  );
};

export default InternationalTourClient; 