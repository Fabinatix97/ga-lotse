/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal";
import { ApiPostPutOtherServiceTemplateRequest } from "@eshg/travel-medicine-api";

import { useOtherServiceTemplateApi } from "@/lib/businessModules/travelMedicine/api/clients";

export function useAddOtherServiceTemplate() {
  const otherServiceTemplateApi = useOtherServiceTemplateApi();
  return useHandledMutation({
    mutationFn: async (request: ApiPostPutOtherServiceTemplateRequest) =>
      otherServiceTemplateApi.createOtherServiceTemplate(request),
  });
}

export function useUpdateOtherServiceTemplate() {
  const otherServiceTemplateApi = useOtherServiceTemplateApi();
  return useHandledMutation({
    mutationFn: async (data: {
      id: string;
      request: ApiPostPutOtherServiceTemplateRequest;
    }) =>
      otherServiceTemplateApi.updateOtherServiceTemplate(data.id, data.request),
  });
}

export function useDeleteOtherServiceTemplate() {
  const otherServiceTemplateApi = useOtherServiceTemplateApi();
  return useHandledMutation({
    mutationFn: async (id: string) =>
      otherServiceTemplateApi.deleteOtherServiceTemplate(id),
  });
}
