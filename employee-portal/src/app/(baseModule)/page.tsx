/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Dashboard } from "@/lib/baseModule/components/dashboard/Dashboard";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function DashboardPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Guten Tag" />}>
      <MainContentLayout>
        <Dashboard />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
