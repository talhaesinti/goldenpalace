'use client';

import React from "react";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ClientContent } from './ClientContent';

const TourDetailClient = ({ initialTourData, error }) => {
  return (
    <ErrorBoundary>
      <ClientContent 
        initialTourData={initialTourData}
        error={error}
      />
    </ErrorBoundary>
  );
};

export default TourDetailClient; 