"use client";

import React, { useEffect, useState } from "react";
import CustomSlider from "../../components/Slider/Slider";
import { Container, Box, Tabs, Tab, useMediaQuery } from "@mui/material";
import bannersAPI from "../api/bannersAPI";
import styles from "../../styles/pages/HakkimizdaPage.module.css"; // Hakkımızda sayfasına özgü stil dosyası
import { formatTitle } from "@/utils/formatters";

// TabPanel yardımcı bileşeni
function TabPanel(props) {
  const { children, value, index, ...other } = props;
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

// Erişilebilirlik özellikleri için yardımcı fonksiyon
function a11yProps(index) {
  return {
    id: `about-tab-${index}`,
    "aria-controls": `about-tabpanel-${index}`,
  };
}

const HakkimizdaPage = () => {
  const [banners, setBanners] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  // Mobil kontrolü için useMediaQuery kullanıyoruz
  const isMobile = useMediaQuery("(max-width:768px)");

  // Tablarda kullanılacak etiketler
  const tabLabels = ["Hakkımızda", "Misyonumuz", "Vizyonumuz", "Deneyim ve Hizmetlerimiz"];

  // Tab etiketleri için stil ayarları: mobilde biraz küçük, minimum genişlik ve aralarda boşluk ekledik
  const tabSxProps = {
    fontWeight: "bold",
    fontSize: isMobile ? "0.9rem" : "1.1rem",
    textTransform: "none",
    color: "black",
    minWidth: isMobile ? 90 : "auto",
    mr: isMobile ? 2 : 0, // Mobilde her bir tab arasında sağ boşluk ekliyoruz
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Banner API çağrısı (parametre "contact" olarak gönderiliyor)
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await bannersAPI.getBanners({
          type: "contact",
          is_active: "true",
        });
        setBanners(response.data);
      } catch (error) {
        console.error("Bannerları alırken bir hata oluştu:", error);
      }
    };

    fetchBanners();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
      
      {/* İçerik için Tab'lar */}
      <Container maxWidth="xl" className={styles.gridContainer}>
        <Box
          className={styles.tabsContainer}
          sx={{
            display: "flex",
            justifyContent: "flex-start", // Mobilde sola hizalı
            borderBottom: 1,
            borderColor: "divider",
            px: isMobile ? 2 : 0, // Kenarlardan içeriye boşluk ekliyoruz
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
            <Tab label="Hakkımızda" {...a11yProps(0)} sx={tabSxProps} />
            <Tab label="Misyonumuz" {...a11yProps(1)} sx={tabSxProps} />
            <Tab label="Vizyonumuz" {...a11yProps(2)} sx={tabSxProps} />
            <Tab label="Deneyim ve Hizmetlerimiz" {...a11yProps(3)} sx={tabSxProps} />
          </Tabs>
        </Box>

        {/* Her TabPanel içinde aktif sekme başlığı metnin sol üstünde gösterilecek */}
        <TabPanel value={tabValue} index={0}>
          <h2 className={styles.activeTabHeading}>{tabLabels[0]}</h2>
          <p>
            Golden Castle Travel olarak, seyahatin sadece bir yolculuk değil, aynı zamanda kültürel 
            bir keşif ve manevi bir deneyim olduğuna inanıyoruz. Bu doğrultuda, tarihsel ve manevi 
            açıdan önemli destinasyonlara odaklanarak sıradışı tur programları hazırlıyoruz. Amacımız, 
            klasik tur programlarının ötesine geçerek misafirlerimizin unutulmaz deneyimler yaşamasını, 
            yeni kültürler keşfetmesini ve seyahat etmeye cesaret kazanmasını sağlamaktır.
          </p>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <h2 className={styles.activeTabHeading}>{tabLabels[1]}</h2>
          <p>
            Misafirlerimize, farklı coğrafyalarda karşılaşabilecekleri engelleri aşmaları için rehberlik 
            etmek, her türlü kolaylığı sağlamak ve seyahatlerini en konforlu ve güvenli şekilde gerçekleştirmelerine 
            yardımcı olmaktır. Bireysel gezginlerden grup turlarına kadar her yolculuğu kişiye özel ve anlamlı 
            hale getirmeyi hedefliyoruz.
          </p>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <h2 className={styles.activeTabHeading}>{tabLabels[2]}</h2>
          <p>
            Seyahat anlayışımızı sürekli genişleterek daha fazla insana yeni destinasyonlar sunmak, kültürel ve 
            manevi deneyimleri herkes için ulaşılabilir kılmak ve uluslararası seyahatlerde güvenilir bir rehber 
            olmak istiyoruz.
          </p>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <h2 className={styles.activeTabHeading}>{tabLabels[3]}</h2>
          <p>
            Golden Castle Travel, kuruluşundan önce 31 ülkelik seyahat tecrübesiyle yola çıkmış bir ekip tarafından 
            kurulmuştur. Dünyayı gezmenin insanlara pozitif bir bakış açısı kazandırdığına inanıyor ve bu deneyimi 
            misafirlerimizle paylaşmayı amaçlıyoruz.
          </p>
          <p>
            <strong>Şu anda sunduğumuz hizmetler arasında:</strong>
          </p>
          <ul>
            <li>Balkanlar, Kuzey Afrika, Ortadoğu, Asya ve Avrupa turları</li>
            <li>Hac, Umre ve Kudüs turları</li>
            <li>Yurt içi ve yurt dışı uçak biletleri</li>
            <li>Havalimanı VIP araç transferleri</li>
            <li>Otel rezervasyonları</li>
            <li>Yurt içinde özel geziler ve araç kiralama hizmetleri</li>
          </ul>
          <p>
            Ayrıca, Afrika&apos;daki yeni destinasyonlarımız ile seyahat ağımızı sürekli genişletiyoruz ve misafirlerimize 
            benzersiz rotalar sunuyoruz.
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