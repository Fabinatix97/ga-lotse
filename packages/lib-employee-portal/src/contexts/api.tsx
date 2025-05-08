/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { createContext, useContext, useState } from "react";

import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { EmployeePortalClients, createClients } from "../api/createClients";

const ApiContext = createContext<EmployeePortalClients | null>(null);

interface ApiProviderProps extends RequiresChildren {
  baseUrl: string;
}

export function ApiProvider(props: ApiProviderProps) {
  const [clients] = useState<EmployeePortalClients>(() =>
    createClients(props.baseUrl),
  );

  return <ApiContext value={clients}>{props.children}</ApiContext>;
}

export function useApi() {
  const employeePortalContext = useContext(ApiContext);

  if (employeePortalContext === null) {
    throw new Error("Missing EmployeePortalProvider");
  }

  return employeePortalContext;
}
