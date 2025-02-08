// components/Footer.js

import styles from './CustomFooter.module.css'; // CSS stil dosyasını import et
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className={styles.customFooter}>
      <div className={styles.footerContent}>
        
        {/* İletişim Bölümü */}
        <div className={`${styles.footerSection} ${styles.rightCizgi}`}>
          <h3>İletişim</h3>
          <p>Adres: Aziz Mahmud Hüdayi Mahallesi, Tepsi Fırını Sokağı No: 13/18 Çakmak İş Hanı, Üsküdar/İstanbul</p>
          <p>Email: <a href="mailto:goldencastle.tr@gmail.com">goldencastle.tr@gmail.com</a></p>
          <p>Telefon: +90 506 046 12 12</p>
        </div>

        {/* Hızlı Linkler */}
        <div className={`${styles.footerSection} ${styles.rightCizgi}`}>
          <h3>Hızlı Linkler</h3>
          <ul>
            <li><Link href="/">Anasayfa</Link></li>
            <li><Link href="/yurtici">Yurt İçi Turlar</Link></li>
            <li><Link href="/yurtdisi">Yurt Dışı Turlar</Link></li>
            <li><Link href="/iletisim">İletişim</Link></li>
            <li><Link href="/hakkimizda">Hakkımızda</Link></li>
          </ul>
        </div>

        {/* Sosyal Medya ve İlgili Kuruluşlar Bölümü */}
        <div className={styles.footerSection}>
          <h3>Sosyal Medya ve İlgili Kuruluşlar</h3>
          <div className={styles.socialIcons}>
            {/* Statik Sosyal Medya İkonları */}
            <a href="https://www.instagram.com/golden.castle.travel/" target="_blank" rel="noopener noreferrer">
              <Image 
                src="/instagram.png" 
                alt="Instagram Icon" 
                width={32} 
                height={32}
                className={styles.icon} 
              />
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
