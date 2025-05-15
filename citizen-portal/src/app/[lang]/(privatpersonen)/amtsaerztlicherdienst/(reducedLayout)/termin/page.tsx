/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { AppointmentForm } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentForm";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function CitizenOmsAppointmentPage() {
  return (
    <PageLayout>
      <PageContent>
        <AppointmentForm />
      </PageContent>
    </PageLayout>
  );
}
