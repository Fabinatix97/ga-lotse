/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { MedicalHistoryTemplateEditor } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/MedicalHistoryTemplateEditor";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";

export default function MedicalHistoryDetailsPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Anamnesebogenvorlage bearbeiten"
          backButton={
            <ToolbarBackButton href={routes.medicalHistoryTemplates.index} />
          }
        />
      }
    >
      <MainContentLayout sx={{ margin: 0, padding: 0 }} fullViewportHeight>
        <MedicalHistoryTemplateEditor templateId={id} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
