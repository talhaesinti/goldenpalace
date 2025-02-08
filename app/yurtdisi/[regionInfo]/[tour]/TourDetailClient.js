'use client';

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import {
  Box,
  Button,
  Grid,
  Modal,
  IconButton,
  Alert,
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
} from "@mui/icons-material";
import Link from 'next/link';
import CustomSlider from "@/components/Slider/Slider";
import styles from "@/styles/pages/InternationalTourDetailPage.module.css";
import { formatTitle, formatRegionTitle, formatPrice } from "@/utils/formatters";

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

const TourDetailClient = ({ initialTourData, error }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (error) {
    return (
      <>
        <div className={styles.bannerContainer}>
          <CustomSlider banners={[]} />
          <div className={styles.bannerBackground} />
          <div className={styles.bannerOverlay}>
            <div className={styles.overlayContent}>
              <h1 className={styles.tourHeader}>
                Tur Bulunamadı
              </h1>
            </div>
          </div>
        </div>

        <div className={`${styles.contentContainer} ${styles.errorContainer}`}>
          <div className={styles.errorContent}>
            <Box className={styles.contentBox}>
              <h2 className={styles.sectionTitle}>
                {error}
              </h2>
              <Button
                variant="contained"
                color="primary"
                href="/yurtdisi"
                sx={{ mt: 2 }}
              >
                Tüm Turları Görüntüle
              </Button>
            </Box>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.bannerContainer}>
        <CustomSlider 
          banners={initialTourData?.thumbnail ? 
            [{ image: initialTourData.thumbnail }] : 
            []} 
        />
        <div className={styles.bannerBackground} />
        <div className={styles.bannerOverlay}>
          <div className={styles.overlayContent}>
            <h1 className={styles.tourHeader}>
              {formatTitle(initialTourData?.name)}
              {initialTourData?.region?.name && (
                <Link href={`/yurtdisi/${initialTourData.region.slug}`}>
                  / <Place /> {formatRegionTitle(initialTourData.region.name)}
                </Link>
              )}
            </h1>
            <div className={styles.bottomContent}>
              <div className={styles.infoLeft}>
                <p className={styles.infoItem}>
                  <CurrencyLira sx={{ marginRight: "8px" }} />
                  {formatPrice(initialTourData?.price)}
                </p>

                {initialTourData?.start_date && initialTourData?.end_date && (
                  <>
                    <p className={styles.infoItem}>
                      <Flight sx={{ marginRight: "8px" }} />
                      {`${calculateDuration(initialTourData.start_date, initialTourData.end_date)} Gece ${calculateDuration(initialTourData.start_date, initialTourData.end_date) + 1} Gün`}
                    </p>
                    <p className={styles.infoItem}>
                      <CalendarToday sx={{ marginRight: "8px" }} />
                      {`${initialTourData.start_date} / ${initialTourData.end_date}`}
                    </p>
                  </>
                )}
              </div>

              <div className={styles.infoRight}>
                {initialTourData?.tour_program_pdf && (
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<Download />}
                    href={initialTourData.tour_program_pdf}
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

      <div className={styles.contentContainer}>
        <div className={styles.mainContent}>
          <Box className={styles.contentBox}>
            <h2 className={styles.sectionTitle}>
              {formatTitle("Tur Detayları")}
            </h2>
            <div 
              className={styles.tourDescription}
              dangerouslySetInnerHTML={{ 
                __html: (initialTourData?.tour_info || "Detay bulunmamaktadır.").replace(/\r\n/g, '<br />') 
              }}
            />
          </Box>

          <Box className={styles.contentBox}>
            <h2 className={styles.sectionTitle}>
              {formatTitle("Tur Görselleri")}
            </h2>
            {(initialTourData?.images || []).length > 0 ? (
              <Grid container spacing={2}>
                {(initialTourData?.images || []).map((image, index) => (
                  <Grid item xs={12} sm={6} key={image?.id || index}>
                    <div 
                      className={styles.imageCard}
                      onClick={() => setSelectedImage(image)}
                    >
                      <div className={styles.imageWrapper}>
                        <Image 
                          src={image?.image || 'https://placehold.co/600x400?text=Golden+Castle+Travel'} 
                          alt={image?.caption || `Tur Görseli ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className={styles.cardImage}
                          style={{ objectFit: 'cover' }}
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

        <div className={styles.sideContent}>
          <div className={styles.stickyBox}>
            <h2 className={styles.sectionTitle}>
              {formatTitle("Tur Bilgileri")}
            </h2>
            
            <div className={styles.infoList}>
              {initialTourData?.region?.name && (
                <Link 
                  href={`/yurtdisi/${initialTourData.region.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className={styles.infoRow}>
                    <Place className={styles.infoIcon} />
                    <div>
                      <h3 className={styles.infoLabel}>Bölge</h3>
                      <p className={styles.infoValue}>
                        {formatRegionTitle(initialTourData.region.name)}
                      </p>
                    </div>
                  </div>
                </Link>
              )}

              {initialTourData?.start_date && (
                <div className={styles.infoRow}>
                  <CalendarToday className={styles.infoIcon} />
                  <div>
                    <h3 className={styles.infoLabel}>Başlangıç Tarihi</h3>
                    <p className={styles.infoValue}>
                      {new Date(initialTourData.start_date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              )}

              {initialTourData?.end_date && (
                <div className={styles.infoRow}>
                  <CalendarToday className={styles.infoIcon} />
                  <div>
                    <h3 className={styles.infoLabel}>Bitiş Tarihi</h3>
                    <p className={styles.infoValue}>
                      {new Date(initialTourData.end_date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              )}

              {initialTourData?.start_date && initialTourData?.end_date && (
                <div className={styles.infoRow}>
                  <AccessTime className={styles.infoIcon} />
                  <div>
                    <h3 className={styles.infoLabel}>Süre</h3>
                    <p className={styles.infoValue}>
                      {`${calculateDuration(initialTourData.start_date, initialTourData.end_date)} Gece ${calculateDuration(initialTourData.start_date, initialTourData.end_date) + 1} Gün`}
                    </p>
                  </div>
                </div>
              )}

              {initialTourData?.airline && (
                <div className={styles.infoRow}>
                  <Flight className={styles.infoIcon} />
                  <div>
                    <h3 className={styles.infoLabel}>Havayolu</h3>
                    <p className={styles.infoValue}>{initialTourData.airline}</p>
                  </div>
                </div>
              )}

              {initialTourData?.price && (
                <div className={`${styles.infoRow} ${styles.priceRow}`}>
                  <CurrencyLira className={styles.infoIcon} />
                  <div>
                    <h3 className={styles.infoLabel}>Fiyat</h3>
                    <p className={styles.priceValue}>
                      {formatPrice(initialTourData.price)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
              alt={selectedImage.caption || 'Tur Görseli'} 
              className={styles.modalImage}
              width={1200}
              height={800}
              priority
              style={{
                width: '100%',
                height: 'auto'
              }}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default TourDetailClient; 