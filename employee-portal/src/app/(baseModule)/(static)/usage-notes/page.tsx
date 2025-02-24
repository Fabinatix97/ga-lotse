/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { UsageNotes } from "@/lib/baseModule/components/usage/UsageNotes";

export default function UsageNotesPage() {
  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={
            "Nutzungshinweise für die sichere Benutzung des Mitarbeitenden-Portals"
          }
        />
      }
    >
      <MainContentLayout>
        <UsageNotes />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
