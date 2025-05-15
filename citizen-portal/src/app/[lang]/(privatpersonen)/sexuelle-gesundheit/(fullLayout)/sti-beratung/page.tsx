/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiConcern } from "@eshg/sti-protection-api";

import { Landingpage } from "@/lib/businessModules/stiProtection/pages/landingpage/Landingpage";

export default function CitizenStiConsultationPage() {
  return <Landingpage concern={ApiConcern.HivStiConsultation} />;
}
