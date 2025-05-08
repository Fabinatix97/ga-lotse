/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { v4 as uuidv4 } from "uuid";

import { isDrawer, useDrawerContext } from "../contexts/drawer";
import { useSidebarScope } from "../contexts/sidebarScope";

const sidenavId = uuidv4();

interface UseSidenavDrawerResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export function useSidenavDrawer(): UseSidenavDrawerResult {
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
