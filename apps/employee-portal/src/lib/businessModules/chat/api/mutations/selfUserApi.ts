/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import { ApiUpdateSelfUserChatAttributesRequest } from "@eshg/base-api";
import { useSnackbar } from "@eshg/lib-portal";

import { useSelfUserApi } from "@/lib/businessModules/chat/api/clients";

export function useUpdateSelfUserChatAttributes() {
  const selfUserApi = useSelfUserApi();
  const snackbar = useSnackbar();

  return useMutation({
    mutationFn: (request: ApiUpdateSelfUserChatAttributesRequest) =>
      selfUserApi.updateSelfUserChatAttributes(request),
    onError: () => {
      snackbar.error("Etwas ist schief gelaufen");
    },
  });
}
