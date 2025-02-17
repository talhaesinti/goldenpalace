'use client';

import { Button, CircularProgress } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import styles from './ErrorUI.module.css';
import { formatTitle } from '@/utils/formatters';
import { useState } from 'react';

export function ErrorUI({ 
  title = "Görüntüleme Hatası",
  message = "Beklenmeyen bir hata oluştu",
  onRetry,
  className 
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRetry = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Tıklama olayının tetiklendiğini konsola yazdırabilirsiniz
      console.log("Retry işlemi başlatılıyor...");
      await onRetry?.();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`${styles.errorContent} ${isLoading ? styles.loading : ''} ${className || ''}`}
      // Burada onClick kaldırıldı, sadece buton tıklaması geçerli olacak
    >
      <h2>{formatTitle(title)}</h2>
      <p>{message}</p>

      {onRetry && (
        <Button
          onClick={handleRetry}
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
          disabled={isLoading}
          className={styles.retryButton}
        >
          {isLoading ? 'Yenileniyor...' : 'Tekrar Dene'}
        </Button>
      )}
    </div>
  );
}
