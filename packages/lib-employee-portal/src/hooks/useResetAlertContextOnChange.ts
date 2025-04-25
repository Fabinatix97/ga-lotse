/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";

import { useResetAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { usePrevious } from "@eshg/lib-portal/hooks/usePrevious";

/**
 * Used by multiple step sidebars to reset the alert when the current step changes.
 *
 * When the provided value changes, the alert context is automatically reset to remove the alert from the sidebar.
 *
 * @param value
 *        The value that indicates what the current step is
 */
export function useResetAlertContextOnChange(value: unknown) {
  const resetAlertContext = useResetAlertContext();
  const previous = usePrevious(value);

  useEffect(() => {
    if (previous !== value) {
      resetAlertContext();
    }
  }, [previous, resetAlertContext, value]);
}
