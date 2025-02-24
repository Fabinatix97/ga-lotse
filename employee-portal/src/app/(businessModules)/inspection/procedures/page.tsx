/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";
import { SearchParams } from "@eshg/lib-portal/helpers/searchParams";

import { PendingFacilitiesOfflineTable } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesOfflineTable";
import { PendingFacilitiesTableWrapper } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesTableWrapper";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

export default function InspectionProceduresPage(
  props: Readonly<{
    searchParams: SearchParams;
  }>,
) {
  const isOffline = useIsOffline();

  const title = isOffline ? "Offline verfügbare Begehungen" : "Begehung";

  return (
    <StickyToolbarLayout toolbar={<Toolbar title={title} />}>
      <MainContentLayout fullViewportHeight>
        {isOffline ? (
          <PendingFacilitiesOfflineTable />
        ) : (
          <PendingFacilitiesTableWrapper filter={props.searchParams} />
        )}
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
