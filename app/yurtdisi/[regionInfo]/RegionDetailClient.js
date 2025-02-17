"use client";

import React from "react";
import { ClientContent } from "./ClientContent";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const RegionDetailClient = ({ initialRegion, initialTours, serverError }) => {
  return (
    <ErrorBoundary>
      <ClientContent
        initialRegion={initialRegion}
        initialTours={initialTours}
        serverError={serverError}
      />
    </ErrorBoundary>
  );
};

export default RegionDetailClient;