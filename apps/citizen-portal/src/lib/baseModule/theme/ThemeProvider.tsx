/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ReactNode } from "react";

import { ThemeRegistry, useNonce } from "@eshg/lib-portal";

import { theme } from "@/lib/baseModule/theme/theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const nonce = useNonce();
  return (
    <ThemeRegistry theme={theme} nonce={nonce}>
      {children}
    </ThemeRegistry>
  );
}
