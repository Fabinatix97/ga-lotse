/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { TextTemplatesOverviewTable } from "@/lib/businessModules/stiProtection/components/textTemplates/TextTemplatesOverviewTable";

export default function TextTemplatesOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Textvorlagen" />}>
      <MainContentLayout>
        <TextTemplatesOverviewTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
