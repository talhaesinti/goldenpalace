// Başlıkların ilk harflerini büyük yapan fonksiyon
export const formatRegionTitle = (title) => {
  if (!title) return '';
  
  // Türkçe karakterleri de doğru şekilde formatla
  return title
    .toLowerCase()
    .split(' ')
    .map(word => {
      const firstLetter = word.charAt(0).toLocaleUpperCase('tr-TR');
      const restOfWord = word.slice(1).toLocaleLowerCase('tr-TR');
      return firstLetter + restOfWord;
    })
    .join(' ');
};

// Genel başlıkları formatlayan fonksiyon
export const formatTitle = (title) => {
  if (!title) return '';
  
  // Özel karakterleri ve fazla boşlukları temizle
  const cleanTitle = title.trim().replace(/\s+/g, ' ');
  
  // Türkçe karakterleri de doğru şekilde formatla
  return cleanTitle
    .split(' ')
    .map(word => {
      // Küçük bağlaçları kontrol et (ve, veya, ile, de, da vb.)
      const smallWords = ['ve', 'veya', 'ile', 'de', 'da', 'den', 'dan'];
      if (smallWords.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      
      const firstLetter = word.charAt(0).toLocaleUpperCase('tr-TR');
      const restOfWord = word.slice(1).toLocaleLowerCase('tr-TR');
      return firstLetter + restOfWord;
    })
    .join(' ');
};

// Fiyat formatlama fonksiyonu
export const formatPrice = (price) => {
  if (!price) return '0 TL';
  
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price) + ' TL';
};

// Tarih formatlama fonksiyonu
export const formatDate = (date) => {
  if (!date) return '';
  
  return new Date(date).toLocaleDateString('tr-TR');
}; 