// components/Footer.js

import styles from './CustomFooter.module.css'; // CSS stil dosyasını import et
import React from 'react';

const Footer = () => {
  return (
    <footer className={styles.customFooter}>
      <div className={styles.footerContent}>
        
        {/* İletişim Bölümü */}
        <div className={`${styles.footerSection} ${styles.rightCizgi}`}>
          <h3>İletişim</h3>
          <p>Adres: Elmalıkent Mah. Elmalıkent Cad. No:4 B Blok Kat:3 34764 Ümraniye / İSTANBUL</p>
          <p>Email: <a href="mailto:info@goldenpalace.com">info@goldenpalace.com</a></p>
          <p>Telefon: +90 216 474 08 60</p>
        </div>

        {/* Hızlı Linkler */}
        <div className={`${styles.footerSection} ${styles.rightCizgi}`}>
          <h3>Hızlı Linkler</h3>
          <ul>
            <li><a href="/">Anasayfa</a></li>
            <li><a href="/yurtici">Yurt İçi Turlar</a></li>
            <li><a href="/yurtdisi">Yurt Dışı Turlar</a></li>
            <li><a href="/iletisim">İletişim</a></li>
            <li><a href="/hakkimizda">Hakkımızda</a></li>
          </ul>
        </div>

        {/* Sosyal Medya ve İlgili Kuruluşlar Bölümü */}
        <div className={styles.footerSection}>
          <h3>Sosyal Medya ve İlgili Kuruluşlar</h3>
          <div className={styles.socialIcons}>
            {/* Statik Sosyal Medya İkonları */}
            <a href="https://www.instagram.com/golden.castle.travel/" target="_blank" rel="noopener noreferrer">
              <img src="/instagram.png" alt="Instagram Icon" className={styles.icon} />
            </a>
          </div>
        </div>
      </div>

      {/* Alt bilgi bölümü */}
      <div className={styles.footerBottom}>
        <p>&copy; 2024 GoldenPalace. Tüm Hakları Saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;
