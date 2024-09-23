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

const NavigationContext = createContext<{
  tryNavigate: (href: string) => void;
  setCanNavigate: (canNavigate: boolean) => void;
}>({
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
});

export function NavigationContextProvider({
  children,
  onBeforeNavigate,
}: PropsWithChildren<{ onBeforeNavigate: (onConfirm: () => void) => void }>) {
  const [canNavigate, setCanNavigate] = useState(true);
  const router = useRouter();

  const contextValue = useMemo(
    () => ({
      setCanNavigate,
      tryNavigate(href: string) {
        if (canNavigate) {
          router.push(href);
        } else {
          onBeforeNavigate(() => {
            setCanNavigate(true);
            router.push(href);
          });
        }
      },
    }),
    [canNavigate, setCanNavigate, router, onBeforeNavigate],
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
