/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledBackgroundQuery } from "@eshg/lib-portal/api/useHandledBackgroundQuery";
import { queryOptions } from "@tanstack/react-query";

import { useOtherServiceTemplateApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { mapOtherServicesTemplates } from "@/lib/businessModules/travelMedicine/api/models/OtherServicesTemplates";
import { otherServiceTemplatesApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllOtherServiceTemplatesQuery() {
  const otherServiceTemplateApi = useOtherServiceTemplateApi();
  return queryOptions({
    queryKey: otherServiceTemplatesApiQueryKey(["getOtherServiceTemplates"]),
    queryFn: () => otherServiceTemplateApi.getOtherServiceTemplates(),
    select: (response) => response.otherServiceTemplates ?? [],
  });
}

export function useGetAllOtherServiceTemplatesUnsuspended(open: boolean) {
  const otherServiceTemplateApi = useOtherServiceTemplateApi();
  return useHandledBackgroundQuery({
    queryKey: otherServiceTemplatesApiQueryKey(["getOtherServiceTemplates"]),
    queryFn: () => otherServiceTemplateApi.getOtherServiceTemplates(),
    select: (response) =>
      response.otherServiceTemplates.map(mapOtherServicesTemplates),
    enabled: open,
    gcTime: 60000,
    staleTime: 60000,
  });
}
