/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useQuery } from "@tanstack/react-query";

import { useMedicalHistoryTemplateApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { medicalHistoryTemplateApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetOneMedicalHistoryTemplate(id: string) {
  const medicalHistoryTemplateApi = useMedicalHistoryTemplateApi();
  return useQuery({
    queryKey: medicalHistoryTemplateApiQueryKey([
      "getOneMedicalHistoryTemplate",
      id,
    ]),
    queryFn: () => medicalHistoryTemplateApi.getOneMedicalHistoryTemplate(id),
    enabled: id.length > 0,
  });
}

export function useGetAllMedicalHistoryTemplatesQuery() {
  const medicalHistoryTemplateApi = useMedicalHistoryTemplateApi();
  return queryOptions({
    queryKey: medicalHistoryTemplateApiQueryKey([
      "getAllMedicalHistoryTemplates",
    ]),
    queryFn: () => medicalHistoryTemplateApi.getAllMedicalHistoryTemplates(),
  });
}
