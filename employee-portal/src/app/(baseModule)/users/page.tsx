/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { UserTable } from "@/lib/baseModule/components/users/UserTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function UserOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={"Benutzer"} />}>
      <MainContentLayout fullViewportHeight>
        <UserTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
