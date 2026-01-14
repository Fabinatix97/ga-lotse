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

import { ProstituteProtectionPersonSearchTable } from "../components/personSearch/ProstituteProtectionPersonSearchTable";

export function ProstituteProtectionPersonSearchPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Personensuche" />}>
      <MainContentLayout fullViewportHeight>
        <ProstituteProtectionPersonSearchTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
