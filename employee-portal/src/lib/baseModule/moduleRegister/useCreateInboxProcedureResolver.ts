/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InboxAwareBusinessModule } from "@/lib/baseModule/components/inboxProcedures/types";
import { useCreateInboxProcedure as inspectionUseCreateInboxProcedure } from "@/lib/businessModules/inspection/shared/useCreateInboxProcedure";
import { useCreateInboxProcedure as measlesProtectionUseCreateInboxProcedure } from "@/lib/businessModules/measlesProtection/shared/useCreateInboxProcedure";
import { useCreateInboxProcedure as schoolEntryUseCreateInboxProcedure } from "@/lib/businessModules/schoolEntry/shared/useCreateInboxProcedure";
import { useCreateInboxProcedure as travelMedicineUseCreateInboxProcedure } from "@/lib/businessModules/travelMedicine/shared/useCreateInboxProcedure";

export function resolveUseCreateInboxProcedure(
  businessModule: InboxAwareBusinessModule,
) {
  switch (businessModule) {
    case "SCHOOL_ENTRY":
      return schoolEntryUseCreateInboxProcedure;
    case "INSPECTION":
      return inspectionUseCreateInboxProcedure;
    case "TRAVEL_MEDICINE":
      return travelMedicineUseCreateInboxProcedure;
    case "MEASLES_PROTECTION":
      return measlesProtectionUseCreateInboxProcedure;
  }
}
