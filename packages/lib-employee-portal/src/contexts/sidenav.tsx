/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { RequiresChildren } from "@eshg/lib-portal/types/react";

interface SidenavContextValue {
  isCollapsed: boolean;
  collapse: () => void;
  expand: () => void;
}

const SidenavContext = createContext<SidenavContextValue | null>(null);

export function SidenavProvider(props: RequiresChildren) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const collapse = useCallback(() => setIsCollapsed(true), [setIsCollapsed]);
  const expand = useCallback(() => setIsCollapsed(false), [setIsCollapsed]);

  const contextValue: SidenavContextValue = useMemo(
    () => ({ isCollapsed, collapse, expand }),
    [isCollapsed, collapse, expand],
  );

  return <SidenavContext value={contextValue}>{props.children}</SidenavContext>;
}

export function useSidenav() {
  const sidenavContext = useContext(SidenavContext);

  if (sidenavContext === null) {
    throw new Error("Missing SidenavContext");
  }

  return sidenavContext;
}
