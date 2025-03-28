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
  useContext,
  useMemo,
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

interface NavigationContextValue {
  tryNavigate: (href: string) => void;
  setCanNavigate: (canNavigate: SetStateAction<boolean>) => void;
  setOnBeforeNavigateProps: (
    onBeforeNavigateProps?: SetStateAction<OnBeforeNavigateProps | undefined>,
  ) => void;
}

const NavigationContext = createContext<NavigationContextValue>({
  tryNavigate: () => {
    throw new Error(
      "Trying to use NavigationContext#tryNavigate without using NavigationContextProvider",
    );
  },
  setCanNavigate: () => {
    throw new Error(
      "Trying to use NavigationContext#setCanNavigate without using NavigationContextProvider",
    );
  },
  setOnBeforeNavigateProps: () => {
    throw new Error(
      "Trying to use NavigationContext#setOnBeforeNavigationProps without using NavigationContextProvider",
    );
  },
});

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
  const router = useRouter();

  const contextValue: NavigationContextValue = useMemo(
    () => ({
      setOnBeforeNavigateProps,
      setCanNavigate,
      tryNavigate(href: string) {
        if (canNavigate) {
          router.push(href);
        } else {
          onBeforeNavigate(() => {
            setCanNavigate(true);
            router.push(href);
          }, onBeforeNavigateProps);
        }
      },
    }),
    [
      canNavigate,
      setCanNavigate,
      router,
      onBeforeNavigate,
      onBeforeNavigateProps,
      setOnBeforeNavigateProps,
    ],
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}
