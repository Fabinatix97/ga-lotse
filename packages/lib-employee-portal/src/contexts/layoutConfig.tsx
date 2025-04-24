/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { createContext, useContext } from "react";

export interface LayoutConfig {
  appBarHeightMobile: string;
  appBarHeightDesktop: string;
  simpleToolbarHeight: string;
}

const LayoutConfigContext = createContext<LayoutConfig | null>(null);

interface LayoutConfigProviderProps extends RequiresChildren {
  config: LayoutConfig;
}

export function LayoutConfigProvider(props: LayoutConfigProviderProps) {
  return (
    <LayoutConfigContext value={props.config}>
      {props.children}
    </LayoutConfigContext>
  );
}

export function useLayoutConfig(): LayoutConfig {
  const layoutConfig = useContext(LayoutConfigContext);

  if (layoutConfig === null) {
    throw new Error("Missing LayoutConfigContext");
  }

  return layoutConfig;
}
