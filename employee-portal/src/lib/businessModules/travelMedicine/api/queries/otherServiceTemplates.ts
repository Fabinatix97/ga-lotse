/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useOtherServiceTemplateApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { otherServiceTemplatesApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllOtherServiceTemplates() {
  const otherServiceTemplateApi = useOtherServiceTemplateApi();
  return useSuspenseQuery({
    queryKey: otherServiceTemplatesApiQueryKey(["getOtherServiceTemplates"]),
    queryFn: () => otherServiceTemplateApi.getOtherServiceTemplates(),
    select: (response) => response.otherServiceTemplates ?? [],
  });
}
