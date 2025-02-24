/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { MedicalHistoryTemplateEditor } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/MedicalHistoryTemplateEditor";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";

export default function MedicalHistoryDetailsPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Anamnesebogenvorlage bearbeiten"
          backHref={routes.medicalHistoryTemplates.index}
        />
      }
    >
      <MainContentLayout sx={{ margin: 0, padding: 0 }} fullViewportHeight>
        <MedicalHistoryTemplateEditor templateId={params.id} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
