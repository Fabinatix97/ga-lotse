/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { UsageNotes } from "@/lib/baseModule/components/usage/UsageNotes";

export default function UsageNotesPage() {
  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar title="Nutzungshinweise für die sichere Benutzung des Mitarbeitenden-Portals" />
      }
    >
      <MainContentLayout>
        <UsageNotes />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
