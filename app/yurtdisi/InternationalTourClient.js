"use client";

import React from "react";
import { ClientContent } from "./ClientContent";
import { ErrorBoundary } from "@/components/ErrorBoundary"; // **Named Import!**

const InternationalTourClient = ({ initialBanners, initialRegions, serverError }) => {
  return (
    <ErrorBoundary>
      <ClientContent
        initialBanners={initialBanners}
        initialRegions={initialRegions}
        serverError={serverError}
      />
    </ErrorBoundary>
  );
};

export default InternationalTourClient;
