/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PropsWithChildren } from "react";

import { EditInspectionPageParams } from "@/app/(businessModules)/inspection/procedures/[id]/layout";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { SubPageHeader } from "@/lib/shared/components/page/SubPageHeader";

export default function InspectionReportEditorPageLayout({
  params,
  children,
}: PropsWithChildren<{
  params: EditInspectionPageParams;
}>) {
  // the MainContentLayout needs zero padding/margin because of the bottom
  // toolbar that's contained therein. The padding/margin is added to some
  // of the children (see InspectionTabReportResult)
  return (
    <StickyToolbarLayout
      toolbar={
        <SubPageHeader
          routeBack={routes.procedures.reportResult(params.id)}
          header={"Bericht bearbeiten"}
        />
      }
    >
      <MainContentLayout sx={{ margin: 0, padding: 0 }} fullViewportHeight>
        {children}
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
