import AboutDetailClient from './AboutDetailClient';
import React from 'react';

async function getAboutData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners?type=about&is_active=true`, {
      next: { revalidate: 86400 } 
    });

    if (!response.ok) {
      return {
        data: null,
        error: "Sunucu yanıt vermedi. Lütfen daha sonra tekrar deneyin."
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    };
  }
}

async function AboutPage() {
  const { data: aboutData, error } = await getAboutData();

  return (
    <AboutDetailClient 
      initialData={aboutData}
      error={error}
    />
  );
}

export default AboutPage;