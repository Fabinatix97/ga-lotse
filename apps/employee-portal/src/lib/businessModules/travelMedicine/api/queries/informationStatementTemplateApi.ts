/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useQuery } from "@tanstack/react-query";

import { useInformationStatementTemplateApi } from "@/lib/businessModules/travelMedicine/api/clients";
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
