/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InformationStatementTemplateEditor } from "@/lib/businessModules/travelMedicine/components/templates/informationStatement/InformationStatementTemplateEditor";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function NewInformationStatementTemplatePage() {
  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Aufklärungsbogenvorlage erstellen"
          backHref={routes.informationStatementTemplates.index}
        />
      }
    >
      <MainContentLayout sx={{ margin: 0, padding: 0 }} fullViewportHeight>
        <InformationStatementTemplateEditor templateId={""} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
