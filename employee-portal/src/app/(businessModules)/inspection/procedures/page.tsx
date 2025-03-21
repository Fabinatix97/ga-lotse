/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { PageProps } from "@eshg/lib-portal/types/pageParams";
import { use } from "react";

import { PendingFacilitiesOfflineTable } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesOfflineTable";
import { PendingFacilitiesTableWrapper } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesTableWrapper";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

export default function InspectionProceduresPage(props: PageProps) {
  const searchParams = use(props.searchParams);
  const isOffline = useIsOffline();

  const title = isOffline ? "Offline verfügbare Begehungen" : "Begehung";

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
