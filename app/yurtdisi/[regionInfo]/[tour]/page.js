"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Grid,
  Modal,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CalendarToday,
  Flight,
  AccessTime,
  CurrencyLira,
  Phone,
  Download,
  Close as CloseIcon,
  Place,
  ArrowBack
} from "@mui/icons-material";
import Link from 'next/link';
import internationalToursAPI from "../../../api/internationalToursAPI";
import CustomSlider from "../../../../components/Slider/Slider";
import styles from "../../../../styles/pages/InternationalTourDetailPage.module.css";
import { formatTitle, formatRegionTitle, formatPrice } from "@/utils/formatters";

const InternationalTourDetailPage = () => {
  const { regionInfo, tour } = useParams();
  const router = useRouter();
  const [tourDetails, setTourDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tour || !regionInfo) {
      setError("Geçersiz tur bilgisi.");
      setLoading(false);
      return;
    }

    let isSubscribed = true; // Memory leak önlemi

    const fetchTourDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await internationalToursAPI.getInternationalTourDetail(tour);
        
        if (!isSubscribed) return;

        if (response?.data) {
          if (response.data.region.slug !== regionInfo) {
            router.push("/404");
            return;
          }
          
          if (!response.data.is_active) {
            setError("Bu tur şu anda aktif değildir.");
            return;
          }

          setTourDetails(response.data);
        } else {
          setError("Tur bilgisi bulunamadı.");
        }
      } catch (error) {
        if (isSubscribed) {
          console.error("Tur detayları alınırken hata oluştu:", error);
          setError("Tur bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchTourDetails();

    return () => {
      isSubscribed = false;
    };
  }, [tour, regionInfo]);

  // Loading durumu
  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress size={40} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Tur bilgileri yükleniyor...
        </Typography>
      </Box>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '70vh',
        flexDirection: 'column',
        gap: 2,
        p: 2
      }}>
        <Alert 
          severity="warning" 
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => router.push("/yurtdisi")}
              startIcon={<ArrowBack />}
            >
              Tüm Turlara Dön
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // Tur detayları yoksa
  if (!tourDetails) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '70vh',
        flexDirection: 'column',
        gap: 2,
        p: 2
      }}>
        <Alert 
          severity="info"
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => router.push("/yurtdisi")}
              startIcon={<ArrowBack />}
            >
              Tüm Turlara Dön
            </Button>
          }
        >
          Tur bilgisi bulunamadı.
        </Alert>
      </Box>
    );
  }

  // Ana içerik
  return (
    <>
      <div className={styles.bannerContainer}>
        <CustomSlider banners={[{ image: tourDetails?.thumbnail }]} />
        <div className={styles.bannerBackground} />
        <div className={styles.bannerOverlay}>
          <div className={styles.overlayContent}>
            <Typography variant="h1" className={styles.tourHeader}>
              {formatTitle(tourDetails?.name)}
              {tourDetails?.region?.name && (
                <Link href={`/yurtdisi/${tourDetails.region.slug}`}>
                  / <Place /> {formatRegionTitle(tourDetails.region.name)}
                </Link>
              )}
            </Typography>
            <div className={styles.bottomContent}>
              <div className={styles.infoLeft}>
                <Typography className={styles.infoItem}>
                  <CurrencyLira sx={{ marginRight: "8px" }} />
                  {formatPrice(tourDetails?.price)}
                </Typography>

                {tourDetails?.start_date && tourDetails?.end_date && (
                  <>
                    <Typography className={styles.infoItem}>
                      <Flight sx={{ marginRight: "8px" }} />
                      {`${calculateDuration(tourDetails.start_date, tourDetails.end_date)} Gece ${calculateDuration(tourDetails.start_date, tourDetails.end_date) + 1} Gün`}
                    </Typography>
                    <Typography className={styles.infoItem}>
                      <CalendarToday sx={{ marginRight: "8px" }} />
                      {`${tourDetails.start_date} / ${tourDetails.end_date}`}
                    </Typography>
                  </>
                )}
              </div>

              <div className={styles.infoRight}>
                {tourDetails?.tour_program_pdf && (
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<Download />}
                    href={tourDetails.tour_program_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.button} ${styles.whiteButton}`}
                  >
                    Tur Programını Yazdır/İndir
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<Phone />}
                  href="tel:02121234567"
                  className={styles.button}
                >
                  Hemen Ara
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentContainer}>
        <div className={styles.mainContent}>
          <Box className={styles.contentBox}>
            <Typography className={styles.sectionTitle}>
              {formatTitle("Tur Detayları")}
            </Typography>
            <div 
              className={styles.tourDescription}
              dangerouslySetInnerHTML={{ 
                __html: (tourDetails?.tour_info || "Detay bulunmamaktadır.").replace(/\r\n/g, '<br />') 
              }}
            />
          </Box>

          {tourDetails?.images && Array.isArray(tourDetails.images) && tourDetails.images.length > 0 && (
            <Box className={styles.contentBox}>
              <Typography className={styles.sectionTitle}>
                {formatTitle("Tur Görselleri")}
              </Typography>
              <Grid container spacing={2}>
                {tourDetails.images.map((image, index) => (
                  <Grid item xs={12} sm={6} key={image?.id || index}>
                    <div 
                      className={styles.imageCard}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={image?.image} 
                        alt={image?.caption || `Tur Görseli ${index + 1}`} 
                      />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </div>

        {/* Side Content */}
        <div className={styles.sideContent}>
          <div className={styles.stickyBox}>
            <Typography className={styles.sectionTitle}>
              {formatTitle("Tur Bilgileri")}
            </Typography>
            
            <div className={styles.infoList}>
              {tourDetails?.region?.name && (
                <Link 
                  href={`/yurtdisi/${tourDetails.region.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className={styles.infoRow}>
                    <Place className={styles.infoIcon} />
                    <div>
                      <Typography className={styles.infoLabel}>Bölge</Typography>
                      <Typography className={styles.infoValue}>
                        {formatRegionTitle(tourDetails.region.name)}
                      </Typography>
                    </div>
                  </div>
                </Link>
              )}

              {tourDetails?.start_date && (
                <div className={styles.infoRow}>
                  <CalendarToday className={styles.infoIcon} />
                  <div>
                    <Typography className={styles.infoLabel}>Başlangıç Tarihi</Typography>
                    <Typography className={styles.infoValue}>
                      {new Date(tourDetails.start_date).toLocaleDateString('tr-TR')}
                    </Typography>
                  </div>
                </div>
              )}

              {tourDetails?.end_date && (
                <div className={styles.infoRow}>
                  <CalendarToday className={styles.infoIcon} />
                  <div>
                    <Typography className={styles.infoLabel}>Bitiş Tarihi</Typography>
                    <Typography className={styles.infoValue}>
                      {new Date(tourDetails.end_date).toLocaleDateString('tr-TR')}
                    </Typography>
                  </div>
                </div>
              )}

              {tourDetails?.start_date && tourDetails?.end_date && (
                <div className={styles.infoRow}>
                  <AccessTime className={styles.infoIcon} />
                  <div>
                    <Typography className={styles.infoLabel}>Süre</Typography>
                    <Typography className={styles.infoValue}>
                      {`${calculateDuration(tourDetails.start_date, tourDetails.end_date)} Gece ${calculateDuration(tourDetails.start_date, tourDetails.end_date) + 1} Gün`}
                    </Typography>
                  </div>
                </div>
              )}

              {tourDetails?.airline && (
                <div className={styles.infoRow}>
                  <Flight className={styles.infoIcon} />
                  <div>
                    <Typography className={styles.infoLabel}>Havayolu</Typography>
                    <Typography className={styles.infoValue}>{tourDetails.airline}</Typography>
                  </div>
                </div>
              )}

              {tourDetails?.price && (
                <div className={`${styles.infoRow} ${styles.priceRow}`}>
                  <CurrencyLira className={styles.infoIcon} />
                  <div>
                    <Typography className={styles.infoLabel}>Fiyat</Typography>
                    <Typography className={styles.priceValue}>
                      {formatPrice(tourDetails.price)}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
            <>
              <img 
                src={selectedImage.image} 
                alt={selectedImage.caption || 'Tur Görseli'} 
                className={styles.modalImage}
              />
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

// Tur süresi hesaplama fonksiyonu
const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

export default InternationalTourDetailPage;
