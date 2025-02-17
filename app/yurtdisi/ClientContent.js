"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Grid, Box } from "@mui/material";
import CustomSlider from "@/components/Slider/Slider";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import styles from "@/styles/pages/InternationalTourPage.module.css";
import { formatTitle, formatRegionTitle } from "@/utils/formatters";
import { fetcher } from "@/utils/fetcher";
import { ErrorUI } from "@/components/ErrorUI";
import Image from "next/image";

// SWR Konfigürasyonu
const SWR_CONFIG = {
  revalidateOnMount: true, 
  revalidateIfStale: true, 
  revalidateOnReconnect: true,
  revalidateOnFocus: false, 
  dedupingInterval: 120000, // 2 dakika
};

export function ClientContent({ initialBanners = [], initialRegions = [], serverError = null }) {
  const router = useRouter();

  // API endpoint’leri
  const bannersEndpoint = "/api/banners?type=international&is_active=true";
  const regionsEndpoint = "/api/regions?is_active=true";

  // Persistent hata state’leri (SSR hatası varsa onu da ekleyin)
  const [persistentBannersError, setPersistentBannersError] = useState(null);
  const [persistentRegionsError, setPersistentRegionsError] = useState(null);
  const [serverErrorState] = useState(serverError);

  // Client tarafında verilerin başarılı şekilde geldiğini takip etmek için flag
  const [clientFetched, setClientFetched] = useState(false);

  // SWR API Çağrıları – fallbackData ve onError/onSuccess callback’leriyle
  const {
    data: bannersData,
    error: bannersError,
    isValidating: bannersValidating,
  } = useSWR(bannersEndpoint, fetcher, {
    ...SWR_CONFIG,
    fallbackData: initialBanners,
    onError: (err) => setPersistentBannersError(err),
    onSuccess: () => setPersistentBannersError(null),
  });
  const {
    data: regionsData,
    error: regionsError,
    isValidating: regionsValidating,
  } = useSWR(regionsEndpoint, fetcher, {
    ...SWR_CONFIG,
    fallbackData: initialRegions,
    onError: (err) => setPersistentRegionsError(err),
    onSuccess: () => setPersistentRegionsError(null),
  });

  // Verileri normalize ediyoruz: Her zaman dizi olarak ele alınsın.
  const banners = Array.isArray(bannersData) ? bannersData : [];
  const regions = Array.isArray(regionsData) ? regionsData : [];

  // Client verileri başarılı geldiyse flag'ı true yapıyoruz
  useEffect(() => {
    if (bannersData && regionsData && !persistentBannersError && !persistentRegionsError) {
      setClientFetched(true);
    }
  }, [bannersData, regionsData, persistentBannersError, persistentRegionsError]);

  /**
   * Hata UI gösterim mantığı:
   * - Eğer persistent hatalardan biri varsa her zaman hata UI gösterilir.
   * - Eğer client verileri henüz gelmediyse (clientFetched false) ve SSR hatası varsa hata UI gösterilir.
   */
  const showErrorUI =
    (persistentBannersError || persistentRegionsError) ||
    (!clientFetched && serverErrorState);

  // Retry Fonksiyonu: Retry butonuna tıklandığında mutate tetikleniyor.
  const handleRetry = useCallback(() => {
    mutate(bannersEndpoint);
    mutate(regionsEndpoint);
  }, [bannersEndpoint, regionsEndpoint]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      {/* Banner Bölümü */}
      <div className={styles.bannerContainer}>
        <CustomSlider banners={banners || initialBanners} />
        <div className={styles.bannerOverlay}>
          <h1 className={styles.bannerTitle}>{formatTitle("Yurt Dışı Turlar")}</h1>
        </div>
      </div>

      {/* Hata UI */}
      {showErrorUI && (
        <Box sx={{ width: "100%", marginTop: 2 }}>
          <h2 className={styles.sectionTitle}>{formatTitle("Bölgeler")}</h2>
          <ErrorUI
            title="Bağlantı Hatası"
            message="Veriler güncellenirken bir hata oluştu."
            onRetry={handleRetry}
          />
        </Box>
      )}

      {/* İçerik: Hata yoksa */}
      {!showErrorUI && (
        <div className={styles.homeContainer}>
          <h2 className={styles.sectionTitle}>{formatTitle("Bölgeler")}</h2>
          {regions === undefined ? null : regions.length === 0 ? (
            <Box className={styles.noResults}>
              <h3 className={styles.noResultsTitle}>
                {formatTitle("Henüz bölge bulunmamaktadır")}
              </h3>
              <p className={styles.noResultsText}>
                {formatTitle("Çok yakında yeni bölgeler eklenecektir")}
              </p>
            </Box>
          ) : (
            <Grid
              container
              spacing={3}
              className={styles.gridContainer}
              justifyContent="center"
            >
              {regions.map((region) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={region?.id}>
                  <div
                    className={styles.regionCard}
                    onClick={() =>
                      region?.slug && router.push(`/yurtdisi/${region.slug}`)
                    }
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
          )}
        </div>
      )}
    </div>
  );
}

export default ClientContent;
