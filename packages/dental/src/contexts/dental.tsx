/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { createContext, useContext, useState } from "react";

import { RequiresChildren } from "@eshg/lib-portal";

import { DentalClients, createClients } from "../api/createClients";

const DentalContext = createContext<DentalClients | null>(null);

interface DentalProviderProps extends RequiresChildren {
  baseUrl: string;
}

export function DentalProvider(props: DentalProviderProps) {
  const [clients] = useState<DentalClients>(() => createClients(props.baseUrl));

  return <DentalContext value={clients}>{props.children}</DentalContext>;
}

export function useDentalApi() {
  const dentalContext = useContext(DentalContext);

  if (dentalContext === null) {
    throw new Error("Missing DentalProvider");
  }

  return dentalContext;
}
