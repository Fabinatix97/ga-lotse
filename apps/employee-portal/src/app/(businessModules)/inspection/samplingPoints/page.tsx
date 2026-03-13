/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import { ApiInspectionFeature } from "@eshg/inspection-api";
import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
import { SamplingPointsTable } from "@/lib/businessModules/inspection/components/SamplingPoints/SamplingPointsTable";

export default function SamplingPointsPage() {
  const featureToggleEnabled = useIsNewFeatureEnabled(
    ApiInspectionFeature.Samples,
  );

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Entnahmestellen" />}>
      <MainContentLayout fullViewportHeight>
        {featureToggleEnabled ? (
          <SamplingPointsTable />
        ) : (
          <Typography>FeatureToggle is Off</Typography>
        )}
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
