/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { AppointmentStepper } from "@/lib/businessModules/travelMedicine/components/appointment/AppointmentStepper";
import { Page } from "@/lib/shared/components/layout/page";

export default function TravelMedicineAppointmentPage() {
  return (
    <Page>
      <AppointmentStepper />
    </Page>
  );
}
