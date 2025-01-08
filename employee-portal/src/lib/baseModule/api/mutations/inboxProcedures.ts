/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InboxAwareBusinessModule } from "@/lib/baseModule/components/inboxProcedures/types";
import { resolveUseCreateInboxProcedure } from "@/lib/baseModule/moduleRegister/useCreateInboxProcedureResolver";

export function useCreateInboxProcedure() {
  const schoolEntryCreateInboxProcedure =
    resolveUseCreateInboxProcedure("SCHOOL_ENTRY")();
  const inspectionCreateInboxProcedure =
    resolveUseCreateInboxProcedure("INSPECTION")();
  const travelMedicineCreateInboxProcedure =
    resolveUseCreateInboxProcedure("TRAVEL_MEDICINE")();
  const measlesProtectionCreateInboxProcedure =
    resolveUseCreateInboxProcedure("MEASLES_PROTECTION")();

  return function (businessModule: InboxAwareBusinessModule) {
    switch (businessModule) {
      case "SCHOOL_ENTRY":
        return schoolEntryCreateInboxProcedure;
      case "INSPECTION":
        return inspectionCreateInboxProcedure;
      case "TRAVEL_MEDICINE":
        return travelMedicineCreateInboxProcedure;
      case "MEASLES_PROTECTION":
        return measlesProtectionCreateInboxProcedure;
    }
  };
}
