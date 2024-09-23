/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReleaseNotes } from "@/lib/baseModule/components/releaseNotes/ReleaseNotes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function ReleaseNotesPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={"Release Notes"} />}>
      <MainContentLayout>
        <ReleaseNotes />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
