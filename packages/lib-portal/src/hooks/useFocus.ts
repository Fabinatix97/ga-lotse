/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";

export function useFocus() {
  const [focused, setFocused] = useState<boolean>(false);
  const [retry, setRetry] = useState<number>(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (focused && ref.current) {
      ref.current.focus();
      if (document.activeElement === ref.current || retry > 5) {
        setFocused(false);
      } else {
        setTimeout(() => setRetry(retry + 1), 100);
      }
    }
  }, [focused, retry]);

  return {
    ref,
    focus: () => setFocused(true),
    reset: () => {
      ref.current = null;
      setFocused(false);
    },
  };
}
