/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { AppointmentStepper } from "@/lib/businessModules/travelMedicine/components/appointment/AppointmentStepper";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function TravelMedicineAppointmentPage() {
  return (
    <PageLayout>
      <PageContent>
        <AppointmentStepper />
      </PageContent>
    </PageLayout>
  );
}
