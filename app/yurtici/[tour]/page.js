"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Box, 
  Typography, 
  Grid, 
  Modal, 
  IconButton,
  Button,
  CircularProgress,
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
import CustomSlider from "../../../components/Slider/Slider";
import domesticToursAPI from "../../api/domesticToursAPI";
import styles from "../../../styles/pages/DomesticTourDetailPage.module.css";
import { formatTitle, formatPrice } from "@/utils/formatters";

const DomesticTourDetailPage = () => {
  const { tour } = useParams();
  const router = useRouter();
  const [tourDetails, setTourDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tour) {
      setError("Geçersiz tur bilgisi.");
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    const fetchTourDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await domesticToursAPI.getDomesticTourDetail(tour);
        
        if (!isSubscribed) return;

        if (response?.data) {
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
  }, [tour]);

  // Loading durumu
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography>Tur bilgileri yükleniyor...</Typography>
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
        minHeight: '50vh',
        flexDirection: 'column',
        gap: 2,
        p: 2
      }}>
        <Alert severity="warning">
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => router.push("/yurtici")}
        >
          Tüm Turlara Dön
        </Button>
      </Box>
    );
  }

  // Veri yoksa
  if (!tourDetails) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column',
        gap: 2,
        p: 2
      }}>
        <Alert severity="info">Tur bilgisi bulunamadı.</Alert>
        <Button 
          variant="contained" 
          onClick={() => router.push("/yurtici")}
        >
          Tüm Turlara Dön
        </Button>
      </Box>
    );
  }

  // TL formatı için yardımcı fonksiyon
  const formatPrice = (price) => {
    if (!price) return 'Fiyat bilgisi yok';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Tüm veriler hazır, ana içeriği render et
  return (
    <>
      {/* Banner Section */}
      <div className={styles.bannerContainer}>
        <CustomSlider banners={[{ image: tourDetails?.thumbnail }]} />
        <div className={styles.bannerBackground}>
          <div className={styles.bannerOverlay}>
            <div className={styles.overlayContent}>
              <Typography variant="h1" className={styles.tourHeader}>
                {formatTitle(tourDetails?.name || 'İsimsiz Tur')}
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
                        <AccessTime sx={{ marginRight: "8px" }} />
                        {`${calculateDuration(
                          tourDetails.start_date,
                          tourDetails.end_date
                        )} Gece ${calculateDuration(
                          tourDetails.start_date,
                          tourDetails.end_date
                        ) + 1} Gün`}
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
                      {`${calculateDuration(tourDetails.start_date, tourDetails.end_date)} Gece
                       ${calculateDuration(tourDetails.start_date, tourDetails.end_date) + 1} Gün`}
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
                      {(tourDetails.price / 1000).toLocaleString("en-US", { 
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 3,
                        style: "decimal"
                      }) + " TL"}
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

// Tur süresi hesaplama
const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

export default DomesticTourDetailPage;