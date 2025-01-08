/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useInboxProcedureApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { useCreateInboxProcedureTemplate } from "@/lib/shared/api/mutations/inboxProcedures";

export function useCreateInboxProcedure() {
  return useCreateInboxProcedureTemplate(useInboxProcedureApi);
}
