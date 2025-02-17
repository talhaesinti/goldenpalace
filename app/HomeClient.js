"use client";

import React from "react";
import HomeClientContent from "./HomeClientContent";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const HomeClient = ({ initialBanners, initialTours, initialRegions, toursError, regionsError }) => {
  return (
    <ErrorBoundary>
      <HomeClientContent 
        initialBanners={initialBanners}
        initialTours={initialTours}
        initialRegions={initialRegions}
        toursError={toursError}
        regionsError={regionsError}
      />
    </ErrorBoundary>
  );
};

export default HomeClient;
