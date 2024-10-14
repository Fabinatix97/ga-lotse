/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledBackgroundQuery } from "@eshg/lib-portal/api/useHandledBackgroundQuery";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { useInformationStatementTemplateApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { mapInformationStatementTemplate } from "@/lib/businessModules/travelMedicine/api/models/InformationStatementTemplates";
import { informationStatementTemplateApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllInformationStatementTemplatesQuery() {
  const informationStatementTemplateApi = useInformationStatementTemplateApi();
  return queryOptions({
    queryKey: informationStatementTemplateApiQueryKey([
      "getAllInformationStatementTemplates",
    ]),
    queryFn: () =>
      informationStatementTemplateApi.getAllInformationStatementTemplates(),
    select: (response) => response.informationStatementTemplates ?? [],
  });
}

export function useGetAllInformationStatementTemplatesUnsuspended(
  open: boolean,
) {
  const informationStatementTemplateApi = useInformationStatementTemplateApi();
  return useHandledBackgroundQuery({
    queryKey: informationStatementTemplateApiQueryKey([
      "getAllInformationStatementTemplates",
    ]),
    queryFn: () =>
      informationStatementTemplateApi.getAllInformationStatementTemplates(),
    select: (response) =>
      response.informationStatementTemplates.map(
        mapInformationStatementTemplate,
      ) ?? [],
    enabled: open,
    gcTime: 60000,
    staleTime: 60000,
  });
}

export function useGetOneInformationStatementTemplate(id: string) {
  const informationStatementTemplateApi = useInformationStatementTemplateApi();
  return useQuery({
    queryKey: informationStatementTemplateApiQueryKey([
      "getOneInformationStatementTemplate",
      id,
    ]),
    queryFn: () =>
      informationStatementTemplateApi.getOneInformationStatementTemplate(id),
    enabled: id.length > 0,
  });
}
