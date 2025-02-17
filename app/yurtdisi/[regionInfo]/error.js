'use client';

import { ClientContent } from './ClientContent';

export default function RegionDetailError({ error, reset }) {
  return (
    <ClientContent 
      initialRegion={null}
      initialTours={[]}
      serverError={{
        message: error.message === 'API_ERROR'
          ? "Sunucu yanıt vermedi. Veriler yüklenirken sorun oluştu."
          : "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      }}
    />
  );
} 