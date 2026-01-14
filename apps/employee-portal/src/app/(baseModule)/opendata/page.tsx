/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { OpenDataTable } from "@/lib/opendata/components/OpenDataTable";

export default function OpenDataPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Open Data" />}>
      <MainContentLayout fullViewportHeight>
        <OpenDataTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
