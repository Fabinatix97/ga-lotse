/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PendingFacilities } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilities";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { SearchParams } from "@/lib/shared/helpers/searchParams";

export default function InspectionProceduresPage(
  props: Readonly<{
    searchParams: SearchParams;
  }>,
) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Begehung" />}>
      <MainContentLayout>
        <PendingFacilities {...props} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
