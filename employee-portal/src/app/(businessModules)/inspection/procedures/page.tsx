/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PendingFacilitiesOfflineTable } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesOfflineTable";
import { PendingFacilitiesTable } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { SearchParams } from "@/lib/shared/helpers/searchParams";
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
          <PendingFacilitiesTable filter={props.searchParams} />
        )}
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
