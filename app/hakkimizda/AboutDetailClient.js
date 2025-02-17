'use client';

import React from "react";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ClientContent from './ClientContent';

const AboutDetailClient = ({ initialData, error }) => {
  return (
    <ErrorBoundary>
      <ClientContent 
        initialData={initialData}
        error={error}
      />
    </ErrorBoundary>
  );
};

export default AboutDetailClient; 