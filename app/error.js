'use client';

import HomeClientContent from './HomeClientContent';

export default function HomeError({ error, reset }) {
  return (
    <HomeClientContent 
      initialBanners={[]}
      initialTours={[]}
      initialRegions={[]}
      serverError={{
        message: error.message === 'API_ERROR'
          ? "Sunucu yanıt vermedi. Veriler yüklenirken sorun oluştu."
          : "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      }}
    />
  );
}
