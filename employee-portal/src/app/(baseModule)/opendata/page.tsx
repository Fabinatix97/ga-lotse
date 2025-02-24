/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBaseFeature } from "@eshg/base-api";
import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

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
