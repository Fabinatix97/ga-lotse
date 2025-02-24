/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { PropsWithChildren } from "react";

import { EditInspectionPageParams } from "@/app/(businessModules)/inspection/procedures/[id]/layout";
import { VaccinationConsultationTabNavigationToolbar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/VaccinationConsultationTabNavigationToolbar";

export default function VaccinationConsultationDetailsLayout({
  params,
  children,
}: PropsWithChildren<{
  params: EditInspectionPageParams;
}>) {
  return (
    <StickyToolbarLayout
      toolbar={<VaccinationConsultationTabNavigationToolbar id={params.id} />}
    >
      <MainContentLayout fullViewportHeight>{children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
