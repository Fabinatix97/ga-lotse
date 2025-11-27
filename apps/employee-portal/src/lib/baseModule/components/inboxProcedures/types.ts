/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/base-api";

import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export const inboxAwareBusinessModuleNames = {
  [ApiBusinessModule.Inspection]:
    businessModuleNames[ApiBusinessModule.Inspection],
  [ApiBusinessModule.SchoolEntry]:
    businessModuleNames[ApiBusinessModule.SchoolEntry],
  [ApiBusinessModule.TravelMedicine]:
    businessModuleNames[ApiBusinessModule.TravelMedicine],
  [ApiBusinessModule.MeaslesProtection]:
    businessModuleNames[ApiBusinessModule.MeaslesProtection],
} satisfies Partial<Record<ApiBusinessModule, string>>;
