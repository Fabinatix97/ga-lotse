/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useUuid } from "@eshg/lib-portal/hooks/useUuid";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { createContext, useContext } from "react";

import { SidebarSlot } from "@/lib/shared/components/drawer/SidebarSlot";

const SidebarScopeContext = createContext<string | undefined>(undefined);

export function SidebarScope(props: RequiresChildren) {
  const scopeId = useUuid();

  return (
    <SidebarScopeContext.Provider value={scopeId}>
      {props.children}
      <SidebarSlot />
    </SidebarScopeContext.Provider>
  );
}

export function useSidebarScope(): string | undefined {
  return useContext(SidebarScopeContext);
}
