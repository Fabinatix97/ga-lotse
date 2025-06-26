/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { RequiresChildren } from "@eshg/lib-portal";

import { ApiProvider } from "./api";
import { LayoutConfig, LayoutConfigProvider } from "./layoutConfig";
import { SessionPersistenceProvider } from "./sessionPersistence";
import { SidenavProvider } from "./sidenav";

interface EmployeePortalProviderProps extends RequiresChildren {
  baseUrl: string;
  layoutConfig: LayoutConfig;
}

export function EmployeePortalProvider(props: EmployeePortalProviderProps) {
  return (
    <ApiProvider baseUrl={props.baseUrl}>
      <LayoutConfigProvider config={props.layoutConfig}>
        <SessionPersistenceProvider>
          <SidenavProvider>{props.children}</SidenavProvider>
        </SessionPersistenceProvider>
      </LayoutConfigProvider>
    </ApiProvider>
  );
}
