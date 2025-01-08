/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UsageNotes } from "@/lib/baseModule/components/usage/UsageNotes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
