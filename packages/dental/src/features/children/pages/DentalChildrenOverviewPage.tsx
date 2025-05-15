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

import { DENTAL_MODULE_NAME } from "../../../translations/businessModule";
import { ChildrenTable } from "../components/childrenOverview/ChildrenTable";

export function DentalChildrenOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={DENTAL_MODULE_NAME} />}>
      <MainContentLayout fullViewportHeight>
        <ChildrenTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
