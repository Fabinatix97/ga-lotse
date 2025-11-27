/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  useIsOffline,
} from "@eshg/lib-employee-portal";
import { PageProps } from "@eshg/lib-portal";

import { PendingFacilitiesOfflineTable } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesOfflineTable";
import { PendingFacilitiesTableWrapper } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesTableWrapper";

export default function InspectionProceduresPage(props: PageProps) {
  const searchParams = use(props.searchParams);
  const isOffline = useIsOffline();

  const title = isOffline
    ? "Hygiene: Offline verfügbare Begehungen"
    : "Hygiene";

  return (
    <StickyToolbarLayout toolbar={<Toolbar title={title} />}>
      <MainContentLayout fullViewportHeight>
        {isOffline ? (
          <PendingFacilitiesOfflineTable />
        ) : (
          <PendingFacilitiesTableWrapper filter={searchParams} />
        )}
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
