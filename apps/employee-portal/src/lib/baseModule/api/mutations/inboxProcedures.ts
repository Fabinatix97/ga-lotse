/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal";
import { ApiCreateInboxProcedureRequest } from "@eshg/lib-procedures-api";

import { InboxAwareBusinessModule } from "@/lib/baseModule/components/inboxProcedures/types";
import { useResolveInboxProcedureApi } from "@/lib/baseModule/moduleRegister/useResolveInboxProcedureApi";

export function useCreateInboxProcedure() {
  const resolveInboxProcedureApi = useResolveInboxProcedureApi();

  return useHandledMutation({
    mutationFn: async ({
      businessModule,
      request,
      file,
    }: {
      businessModule: InboxAwareBusinessModule;
      request: ApiCreateInboxProcedureRequest;
      file?: File;
    }) =>
      resolveInboxProcedureApi(businessModule).addInboxProcedure(request, file),
  });
}
