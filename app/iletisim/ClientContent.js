"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Container, Box, Alert, Button } from "@mui/material";
import CustomSlider from "@/components/Slider/Slider";
import styles from "@/styles/pages/CommunicatonPage.module.css";
import { formatTitle } from "@/utils/formatters";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { Phone } from "@mui/icons-material";
import Image from "next/image";

// SWR Konfigürasyonu
const SWR_CONFIG = {
  revalidateOnMount: true,       // İlk render’da veri çekilsin
  revalidateIfStale: true,       // Cache eskirse yeniden fetch etsin
  revalidateOnReconnect: true,
  revalidateOnFocus: false,
  dedupingInterval: 86400000,     // 24 saat boyunca aynı isteği tekrarlama
  refreshInterval: 0,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};

export function ClientContent({ initialBanner, error: initialError }) {
  // Persistent error state – SWR onError/onSuccess kullanılarak güncellenecek
  const [persistentError, setPersistentError] = useState(null);

  // SWR ile banner verisini çekiyoruz.
  // fallbackData olarak initialBanner, banner nesnesi şeklinde direkt kullanılıyor.
  const { data: swrData, error: swrError, mutate } = useSWR(
    "/api/banners?type=contact&is_active=true",
    fetcher,
    {
      ...SWR_CONFIG,
      fallbackData: initialBanner ? [initialBanner] : [],
      onError: (err) => setPersistentError(err),
      onSuccess: () => setPersistentError(null),
    }
  );

  const finalError = persistentError || swrError || initialError;
  const banners = swrData || [];


  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Retry fonksiyonu – SWR mutate fonksiyonu kullanılarak zorunlu revalidate tetiklenir.
  const handleRetry = useCallback(async () => {
    await mutate(undefined, { revalidate: true });
  }, [mutate]);

  return (
    <div className={styles.internationalTourContainer}>
      {/* Banner Bölümü */}
      <div className={styles.bannerContainer}>
        <CustomSlider banners={banners} />
        <div className={styles.bannerOverlay}>
          <h1 className={styles.bannerTitle}>{formatTitle("İletişim")}</h1>
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

      {/* İletişim Kartları Bölümü */}
      <Container maxWidth="xl" className={styles.gridContainer}>
        <Box className={styles.card}>
          <h3 className={styles.cardTitle}>{formatTitle("Adresimiz")}</h3>
          <p className={styles.cardText}>
            {formatTitle(
              "Aziz Mahmud Hüdayi Mahallesi, Tepsi Fırını Sokağı No: 13/18 Çakmak İş Hanı, Üsküdar/İstanbul"
            )}
          </p>
        </Box>
        <Box className={styles.card}>
          <h3 className={styles.cardTitle}>{formatTitle("Telefon")}</h3>
          <p className={styles.cardText}>
            <a
              href="tel:+905060461212"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Phone style={{ marginRight: "8px" }} />
              +90 506 046 12 12
            </a>
          </p>
        </Box>
        <Box className={styles.card}>
          <h3 className={styles.cardTitle}>{formatTitle("E-posta")}</h3>
          <p className={styles.cardText}>
            <a href="mailto:goldencastle.tr@gmail.com">
              goldencastle.tr@gmail.com
            </a>
          </p>
        </Box>
        <Box className={styles.card}>
          <h3 className={styles.cardTitle}>{formatTitle("Sosyal Medya")}</h3>
          <div className={styles.socialIcons}>
            <a
              href="https://www.instagram.com/golden.castle.travel/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/instagram.png" alt="Instagram" width={50} height={50} />
            </a>
            {/* Diğer sosyal medya ikonlarını ekleyin */}
          </div>
        </Box>
      </Container>

      {/* Harita Bölümü */}
      <div className={styles.map}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d188.13313833261535!2d29.014953663605162!3d41.022407063154944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7c6846e0809%3A0x4d1232cfedd142d8!2sGolden%20Castle%20Travel!5e0!3m2!1str!2str!4v1738620202394!5m2!1str!2str"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Golden Castle Travel Konum"
          aria-label="Golden Castle Travel Ofis Konumu"
        ></iframe>
      </div>
    </div>
  );
}

export default ClientContent;
