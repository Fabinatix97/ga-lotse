/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { AppointmentStepper } from "@/lib/businessModules/travelMedicine/components/appointment/AppointmentStepper";
import { PageContent } from "@/lib/shared/components/layout/PageContent";

export default function TravelMedicineAppointmentPage() {
  return (
    <PageContent>
      <AppointmentStepper />
    </PageContent>
  );
}
