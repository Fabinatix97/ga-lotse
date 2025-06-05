/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiConcern } from "@eshg/sti-protection-api";

import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

import { AppointmentStepper } from "./AppointmentStepper";

export function BookAppointmentPage({ concern }: { concern: ApiConcern }) {
  return (
    <PageLayout>
      <PageContent>
        <AppointmentStepper concern={concern} />
      </PageContent>
    </PageLayout>
  );
}
