'use client';

import { ClientContent } from './ClientContent';

export default function DomesticError({ error, reset }) {
  return (
    <ClientContent 
      initialBanners={[]}
      initialTours={[]}
      serverError={{
        message: error.message === 'API_ERROR'
          ? "Sunucu yanıt vermedi. Veriler yüklenirken sorun oluştu."
          : "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      }}
    />
  );
} 