/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentSection } from "@/lib/businessModules/travelMedicine/components/landing/AppointmentSection";
import { VaccineOverviewSection } from "@/lib/businessModules/travelMedicine/components/landing/VaccineOverviewSection";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

export function LandingpageSidePanel() {
  return (
    <GridColumnStack>
      <AppointmentSection />
      <VaccineOverviewSection />
    </GridColumnStack>
  );
}
