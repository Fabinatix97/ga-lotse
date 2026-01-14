/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiConcern } from "@eshg/sti-protection-api";

import { BookAppointmentPage } from "@/lib/businessModules/stiProtection/components/appointment/BookAppointmentPage";

export default function CitizenStiConsultationBookAppointmentPage() {
  return <BookAppointmentPage concern={ApiConcern.HivStiConsultation} />;
}
