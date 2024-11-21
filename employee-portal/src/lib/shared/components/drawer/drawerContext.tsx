/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useHasChanged } from "@eshg/lib-portal/hooks/useHasChanged";
import { useNavigateEffect } from "@eshg/lib-portal/hooks/useNavigateEffect";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isDefined } from "remeda";

interface DrawerContextValue {
  state: DrawerState;
  tryOpen: (
    drawerId: string,
    drawerType: DrawerType,
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

export interface DrawerOpenOptions<
  TDrawerProps extends DrawerProps = DrawerProps,
> extends DrawerFallbackOptions {
  /**
   * The component to be created when opening the drawer
   */
  component: (props: TDrawerProps) => ReactNode;
  /**
   * Handler to be executed before closing the drawer.
   * The drawer only closes when `confirmClose` is called with `true`.
   * `confirmClose` must be called with `false` in all other cases.
   */
  onBeforeClose?: (confirmClose: (close: boolean) => void) => void;
  /**
   * Handler to be executed after closing the drawer.
   */
  onClose?: () => void;
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

export interface DrawerProps {
  /**
   * Marks the overlay for closing
   * @param force Forces closing the overlay, skipping any confirmation
   */
  onClose: (force?: boolean) => void;
}

export interface DrawerInstance extends DrawerOpenOptions {
  id: string;
  type: DrawerType;
}

type DrawerType = "sidenav" | "sidebar";

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawerContext(): DrawerContextValue {
  const drawerContext = useContext(DrawerContext);

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

  return (
    <DrawerContext.Provider value={drawerContextValue}>
      {children}
    </DrawerContext.Provider>
  );
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
