/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { ApiInspectionFeature } from "@eshg/inspection-api";
import { DynamicPageProps } from "@eshg/lib-portal";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
import { InspectionTabMeasurements } from "@/lib/businessModules/inspection/components/inspection/measurements/InspectionTabMeasurements";

export default function InspectionTabMeasurementsPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);
  const measurementEnabled = useIsNewFeatureEnabled(
    ApiInspectionFeature.Samples,
  );

  if (!measurementEnabled) {
    throw Error("Feature is not enabled");
  }

  return <InspectionTabMeasurements inspectionId={id} />;
}
