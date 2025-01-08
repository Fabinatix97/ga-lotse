/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentSection } from "@/lib/businessModules/travelMedicine/components/landing/AppointmentSection";
import { VaccineOverviewSection } from "@/lib/businessModules/travelMedicine/components/landing/VaccineOverviewSection";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

interface LandingpageSidePanelProps {
  citizenPortalProcedureEnabled: boolean;
}

export function LandingpageSidePanel(
  props: Readonly<LandingpageSidePanelProps>,
) {
  return (
    <GridColumnStack>
      {props.citizenPortalProcedureEnabled && <AppointmentSection />}
      <VaccineOverviewSection />
    </GridColumnStack>
  );
}
