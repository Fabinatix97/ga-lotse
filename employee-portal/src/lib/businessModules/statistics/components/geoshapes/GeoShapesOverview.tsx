/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useState } from "react";

import { ImportGeoShapeSidebar } from "@/lib/businessModules/statistics/components/geoshapes/ImportGeoShapeSidebar/ImportGeoShapeSidebar";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";

import { GeoShapesTable } from "./GeoShapesTable";

export function GeoShapesOverview() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <>
      <GeoShapesTable onImportGeoShapesClick={() => setSidebarOpen(true)} />
      <OverlayBoundary>
        <ImportGeoShapeSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </OverlayBoundary>
    </>
  );
}
