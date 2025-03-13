/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { MedicalHistoryTemplateEditor } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/MedicalHistoryTemplateEditor";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";

export default function MedicalHistoryDetailsPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = props.params;

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
        <MedicalHistoryTemplateEditor templateId={id} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
