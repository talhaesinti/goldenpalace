// app/yurtici/DomesticTourClient.js
"use client";

import React from "react";
import { ClientContent } from "./ClientContent";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const DomesticTourClient = ({ initialBanners, initialTours, serverError }) => {
  return (
    <ErrorBoundary>
      <ClientContent
        initialBanners={initialBanners}
        initialTours={initialTours}
        serverError={serverError}
      />
    </ErrorBoundary>
  );
};

export default DomesticTourClient;