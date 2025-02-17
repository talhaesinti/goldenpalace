'use client';

import { ClientContent } from './ClientContent';

export default function YurtdisiError({ error, reset }) {
  return (
    <ClientContent 
      initialBanners={[]}
      initialRegions={[]}
      serverError={{
        message: error.message === 'API_ERROR'
          ? "Sunucu yanıt vermedi. Veriler yüklenirken sorun oluştu."
          : "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      }}
    />
  );
}
