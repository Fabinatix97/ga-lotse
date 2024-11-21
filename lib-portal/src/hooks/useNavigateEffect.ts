/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useHasChanged } from "./useHasChanged";

/**
 * Calls the specified callback after a page navigation occurred
 */
export function useNavigateEffect(
  onNavigate: () => void | Promise<unknown>,
): void {
  const pathname = usePathname();
  const pathnameChanged = useHasChanged(pathname);

  useEffect(() => {
    if (pathnameChanged) {
      void onNavigate();
    }
  }, [pathnameChanged, onNavigate]);
}
