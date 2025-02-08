// layouts/Layout.js

import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import styles from './Layout.module.css'; // CSS modül stil dosyasını import et
import Image from 'next/image';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
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
    </div>
  );
};

export default Layout;
