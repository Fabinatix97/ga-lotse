/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DrawerOpenOptions,
  DrawerProps,
  isDrawer,
  useDrawerContext,
} from "@/lib/shared/components/drawer/drawerContext";
import { useUuid } from "@/lib/shared/hooks/useUuid";

export type UseSidebarResult<TSidebarProps extends DrawerProps = DrawerProps> =
  CustomSidebarProps<TSidebarProps> extends Record<string, never>
    ? UseParameterlessSidebarResult
    : UseParameterizedSidebarResult<TSidebarProps>;

interface UseParameterlessSidebarResult extends CommonUseSidebarResult {
  open: () => void;
}

interface UseParameterizedSidebarResult<TSidebarProps extends DrawerProps>
  extends CommonUseSidebarResult {
  open: (customOverlayProps: CustomSidebarProps<TSidebarProps>) => void;
}

type CustomSidebarProps<TSidebarProps extends DrawerProps> = Omit<
  TSidebarProps,
  keyof DrawerProps
>;

interface CommonUseSidebarResult {
  isOpen: boolean;
  /**
   * Marks the sidebar for closing
   * @param force Forces closing the sidebar, skipping any confirmation
   */
  close: (force?: boolean) => void;
}

export function useSidebar<TSidebarProps extends DrawerProps>(
  options: DrawerOpenOptions<TSidebarProps>,
): UseSidebarResult<TSidebarProps> {
  const drawerContext = useDrawerContext();
  const sidebarId = useUuid();

  const isOpen = isDrawer(sidebarId, drawerContext.state.open);

  function open(sidebarProps?: CustomSidebarProps<TSidebarProps>): void {
    const SidebarComponent = options.component;
    drawerContext.tryOpen(sidebarId, "sidebar", {
      ...options,
      component: (overlayProps) => {
        const mergedProps = {
          ...sidebarProps,
          ...overlayProps,
        } as TSidebarProps;
        return <SidebarComponent {...mergedProps} />;
      },
    });
  }

  function close(force?: boolean): void {
    void drawerContext.tryClose({ drawerId: sidebarId, force });
  }

  return {
    isOpen,
    open,
    close,
  };
}
