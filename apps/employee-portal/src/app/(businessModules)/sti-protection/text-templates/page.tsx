/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { TextTemplatesOverviewTable } from "@/lib/businessModules/stiProtection/components/textTemplates/TextTemplatesOverviewTable";

export default function TextTemplatesOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Textvorlagen" />}>
      <MainContentLayout fullViewportHeight>
        <TextTemplatesOverviewTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
