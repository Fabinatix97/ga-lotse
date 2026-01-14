/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";

export function useConfirmUnloadEffect(
  triggerLeaveConfirmation: boolean,
): void {
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (triggerLeaveConfirmation) {
        e.preventDefault();
        e.returnValue = true;
        return true;
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [triggerLeaveConfirmation]);
}
