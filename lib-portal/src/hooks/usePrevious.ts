/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";

/**
 * Memoizes value and returns the previous value
 */
export function usePrevious<TValue>(value: TValue): TValue | undefined {
  const ref = useRef<TValue>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
