/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TextTemplatesOverviewTable } from "@/lib/businessModules/stiProtection/components/textTemplates/TextTemplatesOverviewTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function TextTemplatesOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Textvorlagen" />}>
      <MainContentLayout>
        <TextTemplatesOverviewTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
