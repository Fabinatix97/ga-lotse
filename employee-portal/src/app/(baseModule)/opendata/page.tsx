/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBaseFeature } from "@eshg/base-api";
import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { OpenDataTable } from "@/lib/opendata/components/OpenDataTable";
import { ToggledPage } from "@/lib/shared/components/ToggledPage";

export default function OpenDataPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Open Data" />}>
      <MainContentLayout fullViewportHeight>
        <ToggledPage feature={ApiBaseFeature.OpenData}>
          <OpenDataTable />
        </ToggledPage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
