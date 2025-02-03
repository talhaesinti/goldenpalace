// layouts/Layout.js

import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import styles from './Layout.module.css'; // CSS modül stil dosyasını import et

const Layout = ({ children }) => {
  return (
    <html lang="tr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <title>GoldenPalace - Tur ve Tatil</title> {/* Başlık eklendi */}
      </head>
      <body className={`${styles.layout} bg-[#f7f9fc] text-[#2c3e50]`}>
        {/* Navbar */}
        <header className={styles.header}>
          <Navbar />
        </header>

        {/* Ana içerik */}
        <main className={`${styles.container} flex-grow`}>
          <div className={styles.pageContent}>{children}</div>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <Footer />
        </footer>
      </body>
    </html>
  );
};

export default Layout;
