/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useRouter } from "next/navigation";
import {
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { MutationBundle } from "../../types/query";
import { ConfirmationDialogOptions } from "../confirmationDialog/ConfirmationDialogProvider";

export interface OnBeforeNavigateProps {
  onSaveMutation?: MutationBundle;
  confirmationDialogProps?: Omit<ConfirmationDialogOptions, "onConfirm"> & {
    onConfirm?: (onNavigate: () => void) => void;
  };
}

type TryNavigateFn = (href: string) => void;

interface NavigationContextValue {
  tryNavigate: TryNavigateFn;
  setCanNavigate: (canNavigate: SetStateAction<boolean>) => void;
  setOnBeforeNavigateProps: (
    onBeforeNavigateProps?: SetStateAction<OnBeforeNavigateProps | undefined>,
  ) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationContextProvider({
  children,
  onBeforeNavigate,
}: PropsWithChildren<{
  onBeforeNavigate: (
    onNavigate: () => Promise<void> | void,
    onBeforeNavigateProps?: OnBeforeNavigateProps,
  ) => void;
}>) {
  const [canNavigate, setCanNavigate] = useState(true);
  const [onBeforeNavigateProps, setOnBeforeNavigateProps] = useState<
    OnBeforeNavigateProps | undefined
  >(undefined);
  const { push: pushRoute } = useRouter();
  const tryNavigateRef = useRef<TryNavigateFn>(pushRoute);

  const tryNavigate = useCallback<TryNavigateFn>(
    (href) => {
      tryNavigateRef.current(href);
    },
    [tryNavigateRef],
  );

  const contextValue = useMemo(
    () => ({
      tryNavigate,
      setCanNavigate,
      setOnBeforeNavigateProps,
    }),
    [tryNavigate, setCanNavigate, setOnBeforeNavigateProps],
  );

  useEffect(() => {
    if (canNavigate) {
      tryNavigateRef.current = pushRoute;
    } else {
      tryNavigateRef.current = function tryNavigate(href): void {
        onBeforeNavigate(() => {
          setCanNavigate(true);
          pushRoute(href);
        }, onBeforeNavigateProps);
      };
    }
  }, [
    canNavigate,
    setCanNavigate,
    onBeforeNavigate,
    onBeforeNavigateProps,
    pushRoute,
  ]);

  return <NavigationContext value={contextValue}>{children}</NavigationContext>;
}

export function useNavigation(): NavigationContextValue {
  const navigationContext = useContext(NavigationContext);

  if (navigationContext === null) {
    throw new Error("Missing NavigationContext");
  }

  return navigationContext;
}
