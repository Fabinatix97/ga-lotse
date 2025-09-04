/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";

import {
  MainContentLayout,
  StickyToolbarLayout,
} from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal";

import { EditInspectionRouteParams } from "@/app/(businessModules)/inspection/procedures/[id]/layout";
import { VaccinationConsultationTabNavigationToolbar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/VaccinationConsultationTabNavigationToolbar";

export default async function VaccinationConsultationDetailsLayout(
  props: DynamicLayoutProps<EditInspectionRouteParams>,
) {
  const { id } = await props.params;

  return (
    <StickyToolbarLayout
      toolbar={<VaccinationConsultationTabNavigationToolbar id={id} />}
    >
      <MainContentLayout fullViewportHeight>
        <Box display="contents" role="tabpanel">
          {props.children}
        </Box>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
