/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { createContext, useContext } from "react";

import { RequiresChildren, useUuid } from "@eshg/lib-portal";

import { SidebarSlot } from "../components/SidebarSlot";

const SidebarScopeContext = createContext<string | undefined>(undefined);

export function SidebarScope(props: RequiresChildren) {
  const scopeId = useUuid();

  return (
    <SidebarScopeContext value={scopeId}>
      {props.children}
      <SidebarSlot />
    </SidebarScopeContext>
  );
}

export function useSidebarScope(): string | undefined {
  return useContext(SidebarScopeContext);
}
