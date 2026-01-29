/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";

export function useAutoTitleFocus() {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      (document.activeElement === null ||
        document.activeElement === document.body) &&
      titleRef.current?.tagName === "H1"
    ) {
      titleRef.current?.focus();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, []);

  return titleRef;
}
