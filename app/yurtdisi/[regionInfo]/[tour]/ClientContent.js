'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Box, 
  Grid, 
  Modal, 
  IconButton,
  Button,
  Alert
} from "@mui/material";
import { 
  Close as CloseIcon,
  CurrencyLira,
  AccessTime,
  Download,
  Phone,
  CalendarToday,
  Flight,
  Place
} from "@mui/icons-material";
import CustomSlider from "@/components/Slider/Slider";
import styles from "@/styles/pages/InternationalTourDetailPage.module.css";
import { formatTitle, formatRegionTitle } from "@/utils/formatters";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import Link from "next/link";
import { ErrorUI } from "@/components/ErrorUI";

const SWR_CONFIG = {
  revalidateOnMount: true,
  revalidateIfStale: true,
  revalidateOnReconnect: true,
  revalidateOnFocus: false,
  dedupingInterval: 120000,
  refreshInterval: 900000,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000
};

export function ClientContent({ initialTourData, error }) {
  const router = useRouter();
  const params = useParams();
  const tourSlug = params?.tour;
  const regionSlug = params?.regionInfo;

  const [selectedImage, setSelectedImage] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // SWR hatasını kalıcı saklamak için
  const [persistentError, setPersistentError] = useState(null);
  // Client tarafında verinin başarılı çekildiğini takip etmek için flag
  const [clientFetched, setClientFetched] = useState(false);

  // SWR ile veri çekiyoruz, fallbackData olarak initialTourData kullanıyoruz
  const tourEndpoint = tourSlug ? `/api/international-tours/${tourSlug}` : null;

  const {
    data: swrData,
    error: swrError,
    isValidating,
    mutate
  } = useSWR(
    tourEndpoint,
    fetcher,
    {
      ...SWR_CONFIG,
      // ÖNEMLİ: fallbackData olarak server'dan gelen initialTourData
      fallbackData: initialTourData,
      onSuccess: (data) => {
        // Başarılı çekim olduysa persistentError sıfırlansın
        setPersistentError(null);
      },
      onError: (err) => {
        // İstek başarısız olursa persistentError'a atayalım
        setPersistentError(err);
      }
    }
  );

  // Client verileri başarılı geldiyse flag'ı true yapalım
  useEffect(() => {
    if (swrData && !persistentError && !swrError) {
      setClientFetched(true);
    }
  }, [swrData, persistentError, swrError]);

  // Elde edilen veri: SWR'dan gelen veya fallbackData
  const activeData = swrData;

  // Herhangi bir hata varsa (SWR persistent hata, SWR hatası veya SSR'den gelen hata - ancak sadece clientFetched gerçekleşmediyse)
  const hasClientFetchError = !!persistentError || !!swrError;
  const showSSRerror = !clientFetched && !!error;
  const showError = hasClientFetchError || showSSRerror;

  // Aktiflik ve bölge kontrolü (veri varsa)
  const isNotActive = activeData && !activeData.is_active;
  const isWrongRegion = activeData && activeData.region?.slug !== regionSlug;
  const hasDataConflict = isNotActive || isWrongRegion;

  // Eğer SWR verisi varsa ama aktiflik veya bölge uyuşmazlığı varsa hata gösterelim
  const finalShowError = showError || hasDataConflict;

  // finalShowError true ise displayData boş; aksi halde activeData kullanılır
  const displayData = finalShowError ? {} : (activeData || {});

  // Hata mesajı belirleme
  let errorMessage;
  if (showSSRerror) {
    errorMessage = error;
  } else if (persistentError) {
    if (
      persistentError.message === "Failed to fetch" || 
      persistentError.name === "TypeError"
    ) {
      errorMessage = "Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.";
    } else {
      errorMessage = "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
    }
  } else if (isWrongRegion) {
    errorMessage = "Bu tur farklı bir bölgeye ait. Lütfen doğru bölgeden erişmeyi deneyin.";
  } else {
    errorMessage = "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
  }

  // Retry fonksiyonu: veriyi yeniden çek
  const handleRetry = async () => {
    if (!tourEndpoint || isRetrying) return;
    setIsRetrying(true);
    await mutate(tourEndpoint, undefined, { revalidate: true });
    setIsRetrying(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const formatPrice = (price) => {
    if (!price) return "Fiyat bilgisi yok";
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      {/* Banner Section */}
      <div className={styles.bannerContainer}>
        <CustomSlider 
          banners={
            finalShowError 
              ? [] 
              : displayData?.thumbnail 
                ? [{ image: displayData.thumbnail }] 
                : []
          } 
        />
        <div className={styles.bannerBackground}>
          <div className={styles.bannerOverlay}>
            <div className={styles.overlayContent}>
              <h1 className={styles.tourHeader}>
                {finalShowError
                  ? "Tur Bilgileri Yüklenemedi"
                  : formatTitle(displayData?.name || "İsimsiz Tur")}
                {displayData?.region?.name && (
                  <Link href={`/yurtdisi/${displayData.region.slug}`}>
                    /<Place /> {formatRegionTitle(displayData.region.name)}
                  </Link>
                )}
              </h1>
              <div className={styles.bottomContent}>
                {/* Sol taraf (fiyat ve tarih bilgileri) - Hata durumunda gizlenir */}
                {!finalShowError && displayData && (
                  <div className={styles.infoLeft}>
                    <p className={styles.infoItem}>
                      <CurrencyLira sx={{ marginRight: "8px" }} />
                      {formatPrice(displayData.price)}
                    </p>
                    {displayData.start_date && displayData.end_date && (
                      <>
                        <p className={styles.infoItem}>
                          <AccessTime sx={{ marginRight: "8px" }} />
                          {`${calculateDuration(
                            displayData.start_date,
                            displayData.end_date
                          )} Gece ${
                            calculateDuration(displayData.start_date, displayData.end_date) + 1
                          } Gün`}
                        </p>
                        <p className={styles.infoItem}>
                          <CalendarToday sx={{ marginRight: "8px" }} />
                          {`${new Date(displayData.start_date).toLocaleDateString('tr-TR')} / ${new Date(
                            displayData.end_date
                          ).toLocaleDateString('tr-TR')}`}
                        </p>
                      </>
                    )}
                  </div>
                )}
                
                {/* Sağ taraf (butonlar) - Hata durumunda sadece "Hemen Ara" gösterilir */}
                <div className={styles.infoRight}>
                  {!finalShowError && displayData?.tour_program_pdf && (
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      href={displayData.tour_program_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        backgroundColor: "white",
                        color: "black",
                        border: "1px solid #ccc",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                        padding: "10px 16px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                    >
                      Tur Programını Yazdır/İndir
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<Phone />}
                    href="tel:+905060461212"
                    className={styles.button}
                  >
                    Hemen Ara
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hata UI */}
      {finalShowError ? (
        <Box className={`${styles.contentContainer} ${styles.errorContainer}`}>
          <ErrorUI
            title="Tur Bilgileri Yüklenemedi"
            message={errorMessage}
            onRetry={handleRetry}
            onBack={() => router.push("/yurtdisi")}
            backText="Yurt Dışı Turları Görüntüle"
          />
        </Box>
      ) : (
        <div className={styles.contentContainer}>
          <div className={styles.mainContent}>
            {/* Tur Detayları */}
            <Box className={styles.contentBox}>
              <h2 className={styles.sectionTitle}>
                {formatTitle("Tur Detayları")}
              </h2>
              <div
                className={styles.tourDescription}
                dangerouslySetInnerHTML={{
                  __html: (displayData?.tour_info || "Detay bulunmamaktadır.").replace(/\r\n/g, "<br />")
                }}
              />
            </Box>
            {/* Tur Görselleri */}
            <Box className={styles.contentBox}>
              <h2 className={styles.sectionTitle}>
                {formatTitle("Tur Görselleri")}
              </h2>
              {displayData?.images?.length > 0 ? (
                <Grid container spacing={2}>
                  {displayData.images.map((image, index) => (
                    <Grid item xs={12} sm={6} key={image?.id || index}>
                      <div
                        className={styles.imageCard}
                        onClick={() => setSelectedImage(image)}
                      >
                        <div className={styles.imageWrapper}>
                          <Image
                            src={image?.image || "https://placehold.co/600x400?text=Golden+Castle+Travel"}
                            alt={image?.caption || `Tur Görseli ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className={styles.cardImage}
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box className={styles.noResults}>
                  <Alert severity="info">Tur için görsel bulunmamaktadır.</Alert>
                </Box>
              )}
            </Box>
          </div>
          {/* Yan Panel: Tur Bilgileri */}
          <div className={styles.sideContent}>
            <div className={styles.stickyBox}>
              <h2 className={styles.sectionTitle}>
                {formatTitle("Tur Bilgileri")}
              </h2>
              <div className={styles.infoList}>
                {displayData?.region?.name && (
                  <Link
                    href={`/yurtdisi/${displayData.region.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className={styles.infoRow}>
                      <Place className={styles.infoIcon} />
                      <div>
                        <h3 className={styles.infoLabel}>Bölge</h3>
                        <p className={styles.infoValue}>
                          {formatRegionTitle(displayData.region.name)}
                        </p>
                      </div>
                    </div>
                  </Link>
                )}
                {displayData?.start_date && (
                  <div className={styles.infoRow}>
                    <CalendarToday className={styles.infoIcon} />
                    <div>
                      <h3 className={styles.infoLabel}>Başlangıç Tarihi</h3>
                      <p className={styles.infoValue}>
                        {new Date(displayData.start_date).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>
                )}
                {displayData?.end_date && (
                  <div className={styles.infoRow}>
                    <CalendarToday className={styles.infoIcon} />
                    <div>
                      <h3 className={styles.infoLabel}>Bitiş Tarihi</h3>
                      <p className={styles.infoValue}>
                        {new Date(displayData.end_date).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>
                )}
                {displayData?.start_date && displayData?.end_date && (
                  <div className={styles.infoRow}>
                    <AccessTime className={styles.infoIcon} />
                    <div>
                      <h3 className={styles.infoLabel}>Süre</h3>
                      <p className={styles.infoValue}>
                        {`${calculateDuration(displayData.start_date, displayData.end_date)} Gece ${
                          calculateDuration(displayData.start_date, displayData.end_date) + 1
                        } Gün`}
                      </p>
                    </div>
                  </div>
                )}
                {displayData?.airline && (
                  <div className={styles.infoRow}>
                    <Flight className={styles.infoIcon} />
                    <div>
                      <h3 className={styles.infoLabel}>Havayolu</h3>
                      <p className={styles.infoValue}>{displayData.airline}</p>
                    </div>
                  </div>
                )}
                {displayData?.price && (
                  <div className={`${styles.infoRow} ${styles.priceRow}`}>
                    <CurrencyLira className={styles.infoIcon} />
                    <div>
                      <h3 className={styles.infoLabel}>Fiyat</h3>
                      <p className={styles.priceValue}>
                        {formatPrice(displayData.price)}
                        <span className={styles.priceNote}>&apos;den başlayan fiyatlarla</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        className={styles.imageModal}
      >
        <div className={styles.modalContent}>
          <IconButton
            className={styles.closeButton}
            onClick={() => setSelectedImage(null)}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <Image
              src={selectedImage.image}
              alt={selectedImage.caption || "Tur Görseli"}
              className={styles.modalImage}
              width={1200}
              height={800}
              priority
              style={{
                objectFit: "contain",
                width: "100%",
                height: "auto"
              }}
            />
          )}
        </div>
      </Modal>
    </>
  );
}

export default ClientContent;
