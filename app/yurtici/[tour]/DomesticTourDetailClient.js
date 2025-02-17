// app/yurtici/[tour]/DomesticTourDetailClient.js
'use client';

import React from "react";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ClientContent } from './ClientContent';

const DomesticTourDetailClient = ({ initialTourData, error }) => {
  // Direkt error boundary içinde client content'i render et
  return (
    <ErrorBoundary>
      <ClientContent 
        initialTourData={initialTourData}
        error={error}
      />
    </ErrorBoundary>
  );
};

export default DomesticTourDetailClient;