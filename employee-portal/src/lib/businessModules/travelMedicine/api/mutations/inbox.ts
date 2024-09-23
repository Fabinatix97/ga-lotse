/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useInboxProcedureApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { useCloseInboxProcedureTemplate } from "@/lib/shared/components/procedures/inbox/mutations/useCloseInboxProcedureStatusTemplate";

export function useCloseInboxProcedure() {
  return useCloseInboxProcedureTemplate(useInboxProcedureApi);
}
