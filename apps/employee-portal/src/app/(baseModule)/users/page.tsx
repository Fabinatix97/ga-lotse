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

import { UserTable } from "@/lib/baseModule/components/users/UserTable";

export default function UserOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Benutzer" />}>
      <MainContentLayout fullViewportHeight>
        <UserTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
