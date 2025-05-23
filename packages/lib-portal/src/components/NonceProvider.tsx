/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ReactNode, createContext, useContext, useRef } from "react";

const NonceContext = createContext<string | undefined>(undefined);

export function NonceProvider({
  initialNonce,
  children,
}: {
  initialNonce: string | undefined;
  children: ReactNode;
}) {
  const ref = useRef(initialNonce);
  return <NonceContext value={ref.current}>{children}</NonceContext>;
}

export function useNonce() {
  return useContext(NonceContext);
}
