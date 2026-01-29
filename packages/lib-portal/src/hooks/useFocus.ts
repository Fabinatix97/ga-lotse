/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from "react";

export function useFocus() {
  const [focused, setFocused] = useState<boolean>(false);
  const [retry, setRetry] = useState<number>(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (focused && ref.current) {
      ref.current.focus();
      setTimeout(() => {
        if (document.activeElement === ref.current || retry > 5) {
          setFocused(false);
        } else {
          setRetry(retry + 1);
        }
      }, 10);
    }
  }, [focused, retry]);

  const focus = useCallback(() => {
    setFocused(true);
  }, [setFocused]);

  const reset = useCallback(() => {
    ref.current = null;
    setFocused(false);
  }, [setFocused, ref]);

  return {
    ref,
    focus,
    reset,
  };
}
