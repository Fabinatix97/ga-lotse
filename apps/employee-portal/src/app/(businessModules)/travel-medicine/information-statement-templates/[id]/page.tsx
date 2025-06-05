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
import { DynamicPageProps } from "@eshg/lib-portal";

import { InformationStatementTemplateEditor } from "@/lib/businessModules/travelMedicine/components/templates/informationStatement/InformationStatementTemplateEditor";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";

export default function InformationStatementDetailsPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Aufklärungsbogenvorlage bearbeiten"
          backButton={
            <ToolbarBackButton
              href={routes.informationStatementTemplates.index}
            />
          }
        />
      }
    >
      <MainContentLayout sx={{ margin: 0, padding: 0 }} fullViewportHeight>
        <InformationStatementTemplateEditor templateId={id} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
