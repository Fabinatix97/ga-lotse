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

import { InformationStatementTemplateEditor } from "@/lib/businessModules/travelMedicine/components/templates/informationStatement/InformationStatementTemplateEditor";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";

export default function InformationStatementDetailsPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = props.params;

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Aufklärungsbogenvorlage bearbeiten"
          backHref={routes.informationStatementTemplates.index}
        />
      }
    >
      <MainContentLayout sx={{ margin: 0, padding: 0 }} fullViewportHeight>
        <InformationStatementTemplateEditor templateId={id} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
