/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PageContent } from "@/lib/shared/components/layout/PageContent";

import { AppointmentStepper } from "./AppointmentStepper";

export function BookAppointmentPage() {
  return (
    <PageContent>
      <AppointmentStepper />
    </PageContent>
  );
}
