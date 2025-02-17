import config from "@/app/config";

// Geliştirici modunda olup olmadığını kontrol eden yardımcı fonksiyon
const isDevelopment = process.env.NODE_ENV === 'development';

// Debug log helper
const debugLog = (...args) => {
  if (isDevelopment) {
    console.log('[API Debug]:', ...args);
  }
};

// API Fetcher
export const fetcher = async (endpoint) => {
  const url = `${config.url.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  
  debugLog(`Fetching: ${url}`);

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      // Kullanıcı dostu hata mesajı
      const errorMessage = `Sunucudan veri alınırken bir sorun oluştu. (Hata: ${res.status} - ${res.statusText})`;
      debugLog('Response Error:', errorMessage);
      throw new Error(errorMessage);
    }

    const data = await res.json();

    // API'nin boş veri döndürmesini kontrol et
    if (!data || (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0)) {
      throw new Error('Sunucudan geçerli veri alınamadı. Lütfen daha sonra tekrar deneyiniz.');
    }

    debugLog('Response Data:', data);
    return data;
    
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      debugLog('Connection Error:', error);
      throw new Error('Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı ve sunucu durumunu kontrol ediniz.');
    }

    debugLog('Unhandled Error:', error);
    throw error;
  }
};

// POST Fetcher
export const postFetcher = async (endpoint, body) => {
  const url = `${config.url.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`İşlem sırasında sunucudan hata alındı. (Hata: ${res.status})`);
    }

    const data = await res.json();

    if (!data || (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0)) {
      throw new Error('Sunucudan geçerli veri alınamadı. Lütfen daha sonra tekrar deneyiniz.');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol ediniz.');
    }
    throw error;
  }
};
