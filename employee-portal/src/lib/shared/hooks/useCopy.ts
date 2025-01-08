/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

export function useCopy() {
  const snackbar = useSnackbar();

  return async (content: string) => {
    await navigator.clipboard.writeText(content);
    snackbar.notification("Link in die Zwischenablage kopiert");
  };
}
