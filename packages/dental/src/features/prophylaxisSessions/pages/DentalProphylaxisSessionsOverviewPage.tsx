/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { ProphylaxisSessionsTable } from "../components/prophylaxisSessionsOverview/ProphylaxisSessionsTable";

export function DentalProphylaxisSessionsOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Prophylaxen" />}>
      <MainContentLayout fullViewportHeight>
        <ProphylaxisSessionsTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
