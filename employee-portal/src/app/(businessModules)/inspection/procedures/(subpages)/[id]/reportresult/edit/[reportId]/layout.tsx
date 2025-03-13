/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
} from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal/types/pageParams";

import { EditInspectionRouteParams } from "@/app/(businessModules)/inspection/procedures/[id]/layout";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { SubPageHeader } from "@/lib/shared/components/page/SubPageHeader";

export default function InspectionReportEditorPageLayout(
  props: DynamicLayoutProps<EditInspectionRouteParams>,
) {
  const { id } = props.params;

  // the MainContentLayout needs zero padding/margin because of the bottom
  // toolbar that's contained therein. The padding/margin is added to some
  // of the children (see InspectionTabReportResult)
  return (
    <StickyToolbarLayout
      toolbar={
        <SubPageHeader
          routeBack={routes.procedures.reportResult(id)}
          header={"Bericht bearbeiten"}
        />
      }
    >
      <MainContentLayout sx={{ margin: 0, padding: 0 }} fullViewportHeight>
        {props.children}
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
