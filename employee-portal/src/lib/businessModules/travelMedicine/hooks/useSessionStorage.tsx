/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useEffect, useState } from "react";

export function useSessionStorage<T>(
  initialState: T,
  key: string,
): [T, (newValue: T) => void] {
  const hasWindow = typeof window !== "undefined";

  const [value, setValue] = useState<T>(() => getValue());

  function getValue(): T {
    const storedValue = hasWindow ? sessionStorage.getItem(key) : undefined;
    return storedValue ? (JSON.parse(storedValue) as T) : initialState;
  }

  useEffect(() => {
    if (hasWindow) {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  }, [hasWindow, value, key]);

  return [value, setValue];
}
