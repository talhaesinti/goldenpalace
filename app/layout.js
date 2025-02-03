// app/layout.js

import Layout from '../layouts/Layout';
import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}
