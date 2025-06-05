/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { Dashboard } from "@/lib/baseModule/components/dashboard/Dashboard";

export default function DashboardPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Guten Tag" />}>
      <MainContentLayout>
        <Dashboard />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
