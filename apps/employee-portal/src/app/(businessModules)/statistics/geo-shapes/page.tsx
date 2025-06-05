/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { GeoShapesOverview } from "@/lib/businessModules/statistics/components/geoshapes/GeoShapesOverview";

export default function GeoShapesOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Geo-Shapes" />}>
      <MainContentLayout fullViewportHeight>
        <GeoShapesOverview />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
