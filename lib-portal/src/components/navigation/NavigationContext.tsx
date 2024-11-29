/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useRouter } from "next/navigation";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { MutationBundle } from "../../types/query";

interface NavigationContextValue {
  tryNavigate: (href: string) => void;
  setCanNavigate: (canNavigate: boolean) => void;
  setOnSaveMutation: (onSaveMutation?: MutationBundle) => void;
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
  setOnSaveMutation: () => {
    throw new Error(
      "Trying to use NavigationContext#setOnSaveMutation without using NavigationContextProvider",
    );
  },
});

export function NavigationContextProvider({
  children,
  onBeforeNavigate,
}: PropsWithChildren<{
  onBeforeNavigate: (
    onNavigate: () => Promise<void> | void,
    onSaveMutation?: MutationBundle,
  ) => void;
}>) {
  const [canNavigate, setCanNavigate] = useState(true);
  const [onSaveMutation, setOnSaveMutation] = useState<
    MutationBundle | undefined
  >(undefined);
  const router = useRouter();

  const contextValue: NavigationContextValue = useMemo(
    () => ({
      setOnSaveMutation,
      setCanNavigate,
      tryNavigate(href: string) {
        if (canNavigate) {
          router.push(href);
        } else {
          onBeforeNavigate(() => {
            setCanNavigate(true);
            router.push(href);
          }, onSaveMutation);
        }
      },
    }),
    [
      canNavigate,
      setCanNavigate,
      router,
      onBeforeNavigate,
      onSaveMutation,
      setOnSaveMutation,
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
