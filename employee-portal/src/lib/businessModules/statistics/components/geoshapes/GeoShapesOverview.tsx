/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useImportGeoShapeSidebar } from "@/lib/businessModules/statistics/components/geoshapes/ImportGeoShapeSidebar/ImportGeoShapeSidebar";

import { GeoShapesTable } from "./GeoShapesTable";

export function GeoShapesOverview() {
  const importGeoShapeSidebar = useImportGeoShapeSidebar();

  return <GeoShapesTable onImportGeoShapesClick={importGeoShapeSidebar.open} />;
}
