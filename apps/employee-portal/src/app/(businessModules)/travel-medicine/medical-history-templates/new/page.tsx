/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";

import { MedicalHistoryTemplateEditor } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/MedicalHistoryTemplateEditor";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";

export default function NewMedicalHistoryTemplatePage() {
  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Anamnesebogenvorlage erstellen"
          backButton={
            <ToolbarBackButton href={routes.medicalHistoryTemplates.index} />
          }
        />
      }
    >
      <MainContentLayout sx={{ margin: 0, padding: 0 }} fullViewportHeight>
        <MedicalHistoryTemplateEditor />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
