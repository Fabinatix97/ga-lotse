/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useArchivingApi } from "@/lib/businessModules/inspection/api/clients";
import {
  useBulkUpdateProceduresArchivingRelevanceTemplate,
  useExportRelevantProceduresTemplate,
} from "@/lib/shared/api/mutations/archiving";

export function useBulkUpdateProceduresArchivingRelevance() {
  return useBulkUpdateProceduresArchivingRelevanceTemplate(useArchivingApi);
}

export function useExportRelevantProcedures() {
  return useExportRelevantProceduresTemplate(useArchivingApi);
}
