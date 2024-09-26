/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

export function useEditStatisticName() {
  // TODO: Implement, once the API has been defined
  const snackbar = useSnackbar();
  const mutation = useHandledMutation({
    mutationFn: () => Promise.resolve(),
    onSuccess: () => snackbar.confirmation("Name geändert."),
  });
  return async (_name: string) => {
    return mutation.mutateAsync().catch();
  };
}
