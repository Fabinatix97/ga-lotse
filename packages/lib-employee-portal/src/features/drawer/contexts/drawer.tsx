/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isDefined } from "remeda";

import {
  RequiresChildren,
  useHasChanged,
  useNavigateEffect,
} from "@eshg/lib-portal";

import { DrawerOpenOptions } from "../types/drawer";

interface DrawerContextValue {
  state: DrawerState;
  tryOpen: (
    drawerId: string,
    drawerType: DrawerType,
    scopeId: string | undefined,
    options: DrawerOpenOptions,
  ) => void;
  tryClose: (options?: DrawerCloseOptions) => Promise<boolean>;
  isPending: boolean;
  openPending: () => void;
  clearPending: () => void;
}

interface DrawerState {
  open: DrawerInstance | null;
  pending: DrawerInstance | null;
}

export interface DrawerCloseOptions {
  drawerId?: string;
  force?: boolean;
}

export interface DrawerFallbackOptions {
  /**
   * Title to be displayed while loading the overlay and when the overlay throws an error.
   */
  fallbackTitle?: string;
}

export interface DrawerInstance extends DrawerOpenOptions {
  id: string;
  type: DrawerType;
  scopeId?: string;
}

type DrawerType = "sidenav" | "sidebar";

const Drawer = createContext<DrawerContextValue | null>(null);

export function useDrawerContext(): DrawerContextValue {
  const drawerContext = useContext(Drawer);

  if (drawerContext === null) {
    throw new Error("DrawerContext is not initialized");
  }

  return drawerContext;
}

function useCreateDrawerContextValue(): DrawerContextValue {
  const [state, setState] = useState<DrawerState>({
    open: null,
    pending: null,
  });

  return useMemo((): DrawerContextValue => {
    function tryOpen(
      overlayId: string,
      drawerType: DrawerType,
      scopeId: string | undefined,
      options: DrawerOpenOptions,
    ): void {
      if (overlayId === state.open?.id || overlayId === state.pending?.id) {
        return;
      }

      setState((prevState) => ({
        ...prevState,
        pending: {
          ...options,
          id: overlayId,
          type: drawerType,
          scopeId,
        },
      }));
    }

    function tryClose({
      drawerId,
      force = false,
    }: DrawerCloseOptions = {}): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        if (state.open === null) {
          resolve(true);
          return;
        }

        if (isDefined(drawerId) && state.open.id !== drawerId) {
          resolve(false);
          return;
        }

        function doClose(): void {
          setState((prevState) => ({ ...prevState, open: null }));
          state.open?.onClose?.();
          resolve(true);
        }

        if (isDefined(state.open.onBeforeClose) && !force) {
          state.open.onBeforeClose(function confirmClose(close: boolean): void {
            if (!close) {
              resolve(false);
              return;
            }

            doClose();
          });
          return;
        }

        doClose();
      });
    }

    function openPending(): void {
      setState((prevState) => ({
        open: prevState.pending,
        pending: null,
      }));
    }

    function clearPending(): void {
      setState((prevState) => ({
        ...prevState,
        pending: null,
      }));
    }

    return {
      state,
      tryOpen,
      tryClose,
      isPending: state.pending !== null,
      openPending,
      clearPending,
    };
  }, [state, setState]);
}

export function isDrawer(
  drawerId: string,
  drawer: DrawerInstance | null,
): boolean {
  if (drawer === null) {
    return false;
  }

  return drawerId === drawer.id;
}

export function DrawerProvider({ children }: RequiresChildren) {
  const drawerContextValue = useCreateDrawerContextValue();

  // try to open pending drawer
  usePendingEffect(drawerContextValue.isPending, async () => {
    if (await drawerContextValue.tryClose()) {
      drawerContextValue.openPending();
    } else {
      drawerContextValue.clearPending();
    }
  });

  // close drawer after navigation
  useNavigateEffect(() => drawerContextValue.tryClose({ force: true }));

  return <Drawer value={drawerContextValue}>{children}</Drawer>;
}

function usePendingEffect(
  isPending: boolean,
  onChange: () => Promise<void>,
): void {
  const isPendingChanged = useHasChanged(isPending);

  useEffect(() => {
    if (isPending && isPendingChanged) {
      void onChange();
    }
  }, [isPending, isPendingChanged, onChange]);
}
