/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSnackbar } from "@eshg/lib-portal";

export function useCopy() {
  const snackbar = useSnackbar();

  return async (content: string, notification?: string) => {
    await navigator.clipboard.writeText(content);
    snackbar.notification(notification ?? "Link in die Zwischenablage kopiert");
  };
}
