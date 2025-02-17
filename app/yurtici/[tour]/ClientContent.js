'use client';

import React, { useEffect, useState, useCallback } from "react";
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
} from "@mui/icons-material";
import CustomSlider from "@/components/Slider/Slider";
import styles from "@/styles/pages/DomesticTourDetailPage.module.css";
import { formatTitle } from "@/utils/formatters";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { ErrorUI } from "@/components/ErrorUI";

// SWR Konfigürasyonu
const SWR_CONFIG = {
  revalidateOnMount: true,
  revalidateIfStale: true,
  revalidateOnReconnect: true,
  revalidateOnFocus: false,
  dedupingInterval: 120000, // 2 dakika
  refreshInterval: 900000,  // 15 dakika
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000
};

export function ClientContent({ initialTourData, error }) {
  const router = useRouter();
  const params = useParams();
  const tourSlug = params?.tour;
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  // SWR hatasını kalıcı hale getirmek için state
  const [persistentError, setPersistentError] = useState(null);
  // Client tarafı verilerin başarılı çekildiğini takip etmek için flag
  const [clientFetched, setClientFetched] = useState(false);

  // Endpoint oluşturulması
  const tourEndpoint = tourSlug ? `/api/domestic-tours/${tourSlug}` : null;

  const { data: tourData, error: swrError, isValidating, mutate } = useSWR(
    tourEndpoint,
    fetcher,
    {
      ...SWR_CONFIG,
      // Önemli: fallbackData olarak sunucudan gelen initialTourData kullanılıyor
      fallbackData: initialTourData,
      onSuccess: (data) => {
        // Başarılı veri çekiminde hata durumunu sıfırla
        setPersistentError(null);
      },
      onError: (err) => {
        // İstek başarısız olursa persistentError'a atayalım
        setPersistentError(err);
      }
    }
  );

  // Aktif veriyi belirleme (SSR'den gelen veya SWR'den çekilen)
  const activeData = tourData;

  // Client verileri başarılı geldiyse flag'ı true yapalım
  useEffect(() => {
    if (tourData && !persistentError && !swrError) {
      setClientFetched(true);
    }
  }, [tourData, persistentError, swrError]);

  // Hata kaynaklarını kontrol et
  const hasClientFetchError = !!persistentError || !!swrError;
  // Yurt içi için sadece aktiflik kontrolü yapıyoruz (region kontrolü yok)
  const isNotActive = activeData && !activeData.is_active;
  /**
   * finalShowError: 
   * - Eğer SWR hataları varsa veya aktiflik sorunu varsa hata göster.
   * - Ayrıca, clientFetched gerçekleşmemişken SSR'den gelen hata (error) varsa hata göster.
   */
  const finalShowError = hasClientFetchError || ((!clientFetched) && error) || isNotActive;

  // Eğer hata varsa, displayData boş; aksi halde activeData kullanılır
  const displayData = finalShowError ? {} : activeData;

  // Hata mesajı belirleme
  let errorMessage;
  if ((!clientFetched) && error) {
    errorMessage = error;
  } else if (persistentError) {
    if (persistentError.message === "Failed to fetch" || persistentError.name === "TypeError") {
      errorMessage =
        "Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.";
    } else {
      errorMessage =
        "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
    }
  } else if (activeData && !activeData.is_active) {
    errorMessage = "Bu tur aktif değil. Lütfen başka bir tur seçiniz.";
  } else {
    errorMessage =
      "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
  }

  // Retry (yeniden deneme) fonksiyonu
  const handleRetry = async () => {
    if (!tourEndpoint || isRetrying) return;
    setIsRetrying(true);
    await mutate(tourEndpoint, undefined, { revalidate: true });
    setIsRetrying(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const formatPrice = useCallback((price) => {
    if (!price) return "Fiyat bilgisi yok";
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }, []);

  const calculateDuration = useCallback((startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }, []);

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
              </h1>
           
              <div className={styles.bottomContent}>
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
                          )} Gece ${calculateDuration(
                            displayData.start_date,
                            displayData.end_date
                          ) + 1} Gün`}
                        </p>
                        <p className={styles.infoItem}>
                          <CalendarToday sx={{ marginRight: "8px" }} />
                          {`${new Date(
                            displayData.start_date
                          ).toLocaleDateString("tr-TR")} / ${new Date(
                            displayData.end_date
                          ).toLocaleDateString("tr-TR")}`}
                        </p>
                      </>
                    )}
                  </div>
                )}
                <div className={styles.infoRight}>
                  {!finalShowError &&
                    displayData &&
                    displayData.tour_program_pdf && (
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

      {finalShowError ? (
        <Box className={`${styles.contentContainer} ${styles.errorContainer}`}>
          <ErrorUI 
            title="Tur Bilgileri Yüklenemedi"
            message={errorMessage}
            onRetry={handleRetry}
            onBack={() => router.push("/yurtici")}
            backText="Yurt İçi Turları Görüntüle"
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
                            src={
                              image?.image ||
                              "https://placehold.co/600x400?text=Golden+Castle+Travel"
                            }
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
                        {`${calculateDuration(
                          displayData.start_date,
                          displayData.end_date
                        )} Gece ${calculateDuration(
                          displayData.start_date,
                          displayData.end_date
                        ) + 1} Gün`}
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
