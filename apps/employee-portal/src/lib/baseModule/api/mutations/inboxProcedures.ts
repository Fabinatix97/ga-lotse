/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal";
import {
  ApiBusinessModule,
  ApiCreateInboxProcedureRequest,
} from "@eshg/lib-procedures-api";

import { useResolveInboxProcedureApi } from "@/lib/baseModule/moduleRegister/useResolveInboxProcedureApi";

export function useCreateInboxProcedure() {
  const resolveInboxProcedureApi = useResolveInboxProcedureApi();

  return useHandledMutation({
    mutationFn: async ({
      businessModule,
      request,
      file,
    }: {
      businessModule: ApiBusinessModule;
      request: ApiCreateInboxProcedureRequest;
      file?: File;
    }) =>
      resolveInboxProcedureApi(businessModule).addInboxProcedure(request, file),
  });
}
