/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/employee-portal-api/base";

import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export const InboxAwareBusinessModule = {
  Inspection: "INSPECTION",
  SchoolEntry: "SCHOOL_ENTRY",
  TravelMedicine: "TRAVEL_MEDICINE",
  MeaslesProtection: "MEASLES_PROTECTION",
} as const;

export type InboxAwareBusinessModule =
  (typeof InboxAwareBusinessModule)[keyof typeof InboxAwareBusinessModule];

export const inboxAwareBusinessModuleNames = {
  [InboxAwareBusinessModule.Inspection]:
    businessModuleNames[ApiBusinessModule.Inspection],
  [InboxAwareBusinessModule.SchoolEntry]:
    businessModuleNames[ApiBusinessModule.SchoolEntry],
  [InboxAwareBusinessModule.TravelMedicine]:
    businessModuleNames[ApiBusinessModule.TravelMedicine],
  [InboxAwareBusinessModule.MeaslesProtection]:
    businessModuleNames[ApiBusinessModule.MeaslesProtection],
} satisfies Record<InboxAwareBusinessModule, string>;
