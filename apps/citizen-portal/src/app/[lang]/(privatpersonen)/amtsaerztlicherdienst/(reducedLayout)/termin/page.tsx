/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { AppointmentForm } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentForm";
import { PageContent } from "@/lib/shared/components/layout/PageContent";

export default function CitizenOmsAppointmentPage() {
  return (
    <PageContent>
      <AppointmentForm />
    </PageContent>
  );
}
