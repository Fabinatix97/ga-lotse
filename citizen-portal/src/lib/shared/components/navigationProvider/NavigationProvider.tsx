/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { NavigationContextProvider } from "@eshg/lib-portal/components/navigation/NavigationContext";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

export function NavigationProvider({ children }: Readonly<RequiresChildren>) {
  function onBeforeNavigate() {
    return;
  }

  return (
    <NavigationContextProvider onBeforeNavigate={onBeforeNavigate}>
      {children}
    </NavigationContextProvider>
  );
}
