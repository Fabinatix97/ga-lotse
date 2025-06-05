/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { NavigationContextProvider, RequiresChildren } from "@eshg/lib-portal";

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
