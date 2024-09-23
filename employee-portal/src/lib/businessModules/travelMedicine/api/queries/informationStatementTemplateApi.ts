/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useInformationStatementTemplateApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { informationStatementTemplateApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllInformationStatementTemplates() {
  const informationStatementTemplateApi = useInformationStatementTemplateApi();
  return useSuspenseQuery({
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
