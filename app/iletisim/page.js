"use client"; // Next.js'de client-side rendering için gerekli

import React, { useEffect, useState } from "react";
import CustomSlider from "../../components/Slider/Slider"; // CustomSlider bileşenini dahil edin
import { Grid, Typography, Container, Box } from "@mui/material";
import bannersAPI from "../api/bannersAPI";
import styles from "../../styles/pages/CommunicatonPage.module.css"; // Sayfa bazlı stil dosyasını dahil edin
import { formatTitle } from "@/utils/formatters";

const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [isMobile, setIsMobile] = useState(false); // Mobil olup olmadığını kontrol etmek için state

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    // API'den bannerları almak için çağrı
    const fetchBanners = async () => {
      try {
        const response = await bannersAPI.getBanners({
          type: "home",
          is_active: "true",
        }); // Ana sayfa bannerlarını al
        setBanners(response.data);
      } catch (error) {
        console.error("Bannerları alırken bir hata oluştu:", error);
      }
    };

    fetchBanners();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.internationalTourContainer}>
      {/* Öne çıkan slider bileşeni */}
      <div className={styles.bannerContainer}>
        <CustomSlider banners={banners} />
        <div className={styles.bannerOverlay}>
          <Typography className={styles.bannerTitle}>
            {formatTitle("İletişim")}
          </Typography>
        </div>
      </div>

      {/* İletişim kartları bölümü */}
      <Container maxWidth="xl" className={styles.gridContainer}>
        <div className={styles.card}>
          <h3 style={{ fontWeight: "bold" }}>
            {formatTitle("Adresimiz")}
          </h3>
          <p>
            {formatTitle("Elmalikent Mah. Elmalikent Cad. No:4 B Blok Kat:3 34764 Ümraniye / İstanbul")}
          </p>
        </div>

        <div className={styles.card}>
          <h3 style={{ fontWeight: "bold" }}>
            {formatTitle("Telefon")}
          </h3>
          <p>+90 216 474 08 60 / 2910 - 2918</p>
        </div>

        <div className={styles.card}>
          <h3 style={{ fontWeight: "bold" }}>
            {formatTitle("E-posta")}
          </h3>
          <p className={styles.mail}>
            <a href="mailto:info@kuramer.org">info@kuramer.org</a>
          </p>
        </div>

        <div className={styles.card}>
          <h3 style={{ fontWeight: "bold" }}>
            {formatTitle("Sosyal Medya")}
          </h3>
          <div className={styles.socialIcons}>
            <a
              href="https://www.instagram.com/golden.castle.travel/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/instagram.png" alt="Instagram" />
            </a>
          </div>
        </div>
      </Container>

      {/* Harita bölümü */}
      <div className={styles.map}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96311.2619001974!2d28.946335297265623!3d41.0312297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7fb3558c6d1%3A0xd65734d1cb19db8c!2sKURAMER!5e0!3m2!1str!2str!4v1707150169725!5m2!1str!2str"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default HomePage;
