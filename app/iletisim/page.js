"use client"; // Next.js'de client-side rendering için gerekli

import React, { useEffect, useState } from "react";
import CustomSlider from "../../components/Slider/Slider"; // CustomSlider bileşenini dahil edin
import { Grid, Container, Box } from "@mui/material";
import bannersAPI from "../api/bannersAPI";
import styles from "../../styles/pages/CommunicatonPage.module.css"; // Sayfa bazlı stil dosyasını dahil edin
import { formatTitle } from "@/utils/formatters";
import Image from 'next/image'

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
          type: "contact",
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
          <h1 className={styles.bannerTitle}>
            {formatTitle("İletişim")}
          </h1>
        </div>
      </div>

      {/* İletişim kartları bölümü */}
      <Container maxWidth="xl" className={styles.gridContainer}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            {formatTitle("Adresimiz")}
          </h3>
          <p className={styles.cardText}>
            {formatTitle("Aziz Mahmud Hüdayi Mahallesi, Tepsi Fırını Sokağı No: 13/18 Çakmak İş Hanı, Üsküdar/İstanbul")}
          </p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            {formatTitle("Telefon")}
          </h3>
          <p className={styles.cardText}>+90 506 046 12 12</p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            {formatTitle("E-posta")}
          </h3>
          <p className={styles.cardText}>
            <a href="mailto:goldencastle.tr@gmail.com">goldencastle.tr@gmail.com</a>
          </p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            {formatTitle("Sosyal Medya")}
          </h3>
          <div className={styles.socialIcons}>
            <a
              href="https://www.instagram.com/golden.castle.travel/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image 
                src="/instagram.png"
                alt="Instagram"
                width={50}
                height={50}
              />
            </a>
          </div>
        </div>
      </Container>

      {/* Harita bölümü */}
      <div className={styles.map}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d188.13313833261535!2d29.014953663605162!3d41.022407063154944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7c6846e0809%3A0x4d1232cfedd142d8!2sGolden%20Castle%20Travel!5e0!3m2!1str!2str!4v1738620202394!5m2!1str!2str"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      </div>
    </div>
  );
};

export default HomePage;
