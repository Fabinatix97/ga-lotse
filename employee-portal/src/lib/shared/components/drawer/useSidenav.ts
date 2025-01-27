/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { v4 as uuidv4 } from "uuid";

import { useSidebarScope } from "@/lib/shared/components/drawer/SidebarScope";
import {
  isDrawer,
  useDrawerContext,
} from "@/lib/shared/components/drawer/drawerContext";

const sidenavId = uuidv4();

interface UseSidenavResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export function useSidenav(): UseSidenavResult {
  const drawerContext = useDrawerContext();
  const scopeId = useSidebarScope();

  const isOpen = isDrawer(sidenavId, drawerContext.state.open);

  function open(): void {
    drawerContext.tryOpen(sidenavId, "sidenav", scopeId, {
      component: () => null,
    });
  }

  function close(): void {
    void drawerContext.tryClose({ drawerId: sidenavId });
  }

  return {
    isOpen,
    open,
    close,
  };
}
