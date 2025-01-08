/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiCreateInboxProcedureRequest,
  ApiInboxProcedure,
} from "@eshg/employee-portal-api/businessProcedures";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";

export function useCreateInboxProcedureTemplate(
  useInboxProcedureApi: () => {
    addInboxProcedure: (
      createInboxProcedureRequest: ApiCreateInboxProcedureRequest,
      file?: Blob,
    ) => Promise<ApiInboxProcedure>;
  },
) {
  const inboxProcedureApi = useInboxProcedureApi();
  return useHandledMutation({
    mutationFn: async ({
      request,
      file,
    }: {
      request: ApiCreateInboxProcedureRequest;
      file?: File;
    }) => inboxProcedureApi.addInboxProcedure(request, file),
  });
}
