/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ReactNode } from "react";

import { useNonce } from "@eshg/lib-portal/components/NonceProvider";
import { ThemeRegistry } from "@eshg/lib-portal/components/themeRegistry/ThemeRegistry";

import { theme } from "./theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const nonce = useNonce();
  return (
    <ThemeRegistry theme={theme} nonce={nonce}>
      {children}
    </ThemeRegistry>
  );
}
