"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Box,
  Tabs,
  Tab,
  useMediaQuery,
  Alert,
  Button,
} from "@mui/material";
import CustomSlider from "@/components/Slider/Slider";
import styles from "@/styles/pages/HakkimizdaPage.module.css";
import { formatTitle } from "@/utils/formatters";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";

// SWR Konfigürasyonu
const SWR_CONFIG = {
  revalidateOnMount: true,
  revalidateIfStale: true,
  revalidateOnReconnect: true,
  revalidateOnFocus: false,
  dedupingInterval: 86400000, // 24 saat
  refreshInterval: 0,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};

// TabPanel yardımcı bileşeni
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`about-tabpanel-${index}`}
      aria-labelledby={`about-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div className={styles.tabContent}>{children}</div>
        </Box>
      )}
    </div>
  );
}

// Erişilebilirlik için yardımcı fonksiyon
function a11yProps(index) {
  return {
    id: `about-tab-${index}`,
    "aria-controls": `about-tabpanel-${index}`,
  };
}

/**
 * Bu sayfada "initialBanner" sunucudan gelen banner verisini temsil eder.
 * SWR çalışırken fallbackData olarak kullanılır, ancak SWR’dan hata gelirse
 * hata Alert'i (banner'ın altında) gösterilir.
 */
const HakkimizdaPage = ({ initialBanner, error }) => {
  // Sekme kontrolü
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  // Persistent hata state
  const [persistentError, setPersistentError] = useState(null);
  const isMobile = useMediaQuery("(max-width:768px)");

  // SWR ile banner verisini çekiyoruz.
  const { data: swrData, error: swrError, mutate } = useSWR(
    "/api/banners?type=about&is_active=true",
    fetcher,
    {
      ...SWR_CONFIG,
      fallbackData: initialBanner ? [initialBanner] : [],
      onError: (err) => setPersistentError(err),
      onSuccess: () => setPersistentError(null),
    }
  );

  // Revize edilmiş hata yönetimi: SWR verisinin varlığına bakılmaksızın hata varsa göster.
  const finalError = persistentError || swrError || error;
  const banners = swrData || [];

  // Retry fonksiyonu: SWR mutate fonksiyonu kullanılarak revalidate tetiklenir.
  const handleRetry = useCallback(() => {
    mutate(undefined, { revalidate: true });
  }, [mutate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className={styles.internationalTourContainer}>
      {/* Banner Bölümü */}
      <div className={styles.bannerContainer}>
        <CustomSlider banners={banners} />
        <div className={styles.bannerOverlay}>
          <h1 className={styles.bannerTitle}>
            {formatTitle("Hakkımızda – Golden Castle Travel")}
          </h1>
        </div>
      </div>

      {/* Hata Alert'i: Banner ile içerik arasında */}
      {finalError && (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 2, px: 2 }}>
          <Alert
            severity="error"
            sx={{
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box sx={{ mb: 2 }}>
              {typeof finalError === "object" && finalError.message
                ? finalError.message
                : "Beklenmeyen bir hata oluştu."}
            </Box>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleRetry}
            >
              Tekrar Dene
            </Button>
          </Alert>
        </Box>
      )}

      {/* Sekmeli İçerik */}
      <Container maxWidth="xl" className={styles.gridContainer}>
        <Box
          className={styles.tabsContainer}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            borderBottom: 1,
            borderColor: "divider",
            px: isMobile ? 2 : 0,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="hakkimizda tabs"
            variant={isMobile ? "scrollable" : "standard"}
            centered={!isMobile}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
          >
            {["Hakkımızda", "Misyonumuz", "Vizyonumuz", "Deneyim ve Hizmetlerimiz"].map(
              (label, index) => (
                <Tab
                  key={index}
                  label={label}
                  {...a11yProps(index)}
                  sx={{
                    fontWeight: "bold",
                    fontSize: isMobile ? "0.9rem" : "1.1rem",
                    textTransform: "none",
                    color: "black",
                    minWidth: isMobile ? 90 : "auto",
                    mr: isMobile ? 2 : 0,
                  }}
                />
              )
            )}
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <h2 className={styles.activeTabHeading}>Hakkımızda</h2>
          <p>
            Golden Castle Travel olarak, seyahatin sadece bir yolculuk değil,
            aynı zamanda kültürel bir keşif ve manevi deneyim olduğuna inanıyoruz.
            Bu doğrultuda, tarihsel ve manevi açıdan önemli destinasyonlara
            odaklanarak sıradışı tur programları hazırlıyoruz.
          </p>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <h2 className={styles.activeTabHeading}>Misyonumuz</h2>
          <p>
            Misafirlerimize, farklı coğrafyalarda karşılaşabilecekleri engelleri
            aşmaları için rehberlik etmek, her türlü kolaylığı sağlamak ve
            seyahatlerini en konforlu ve güvenli şekilde gerçekleştirmelerine
            yardımcı olmaktır.
          </p>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <h2 className={styles.activeTabHeading}>Vizyonumuz</h2>
          <p>
            Seyahat anlayışımızı sürekli genişleterek daha fazla insana yeni
            destinasyonlar sunmak, kültürel ve manevi deneyimleri herkes için
            ulaşılabilir kılmak istiyoruz.
          </p>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <h2 className={styles.activeTabHeading}>Deneyim ve Hizmetlerimiz</h2>
          <p>
            Golden Castle Travel, kuruluşundan önce 31 ülkelik seyahat
            tecrübesiyle yola çıkmış bir ekip tarafından kurulmuştur. Dünyayı
            gezmenin insanlara pozitif bir bakış açısı kazandırdığına inanıyor
            ve bu deneyimi misafirlerimizle paylaşmayı amaçlıyoruz.
          </p>
          <p>
            <strong>Şu anda sunduğumuz hizmetler arasında:</strong>
          </p>
          <ul>
            <li>Balkanlar, Kuzey Afrika, Ortadoğu, Asya ve Avrupa turları</li>
            <li>Hac, Umre ve Kud&apos;s turları</li>
            <li>Yurt içi ve yurt dışı uçak biletleri</li>
            <li>Havalimanı VIP araç transferleri</li>
            <li>Otel rezervasyonları</li>
            <li>Yurt içinde özel geziler ve araç kiralama hizmetleri</li>
          </ul>
          <p>
            Ayrıca, Afrika&apos;daki yeni destinasyonlarımız ile seyahat ağımızı
            sürekli genişletiyoruz ve misafirlerimize benzersiz rotalar
            sunuyoruz.
          </p>
          <p>
            Golden Castle Travel ile keşfetmeye ve yeni deneyimlere adım atmaya hazır olun!
          </p>
        </TabPanel>
      </Container>
    </div>
  );
};

export default HakkimizdaPage;
