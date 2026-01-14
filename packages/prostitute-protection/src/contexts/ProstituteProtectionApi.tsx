/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ReactNode, createContext, useContext, useRef } from "react";

import {
  ProstituteProtectionClients,
  createClients,
} from "../api/createClients";

const ProstituteProtectionContext =
  createContext<ProstituteProtectionClients | null>(null);

export function ProstituteProtectionApiClientProvider({
  children,
  baseUrl,
}: {
  baseUrl: string;
  children: ReactNode;
}) {
  const clients = useRef(createClients(baseUrl));

  return (
    <ProstituteProtectionContext value={clients.current}>
      {children}
    </ProstituteProtectionContext>
  );
}

export function useProstituteProtectionApiClients() {
  const prostituteProtectionContext = useContext(ProstituteProtectionContext);

  if (prostituteProtectionContext === null) {
    throw new Error("Missing Prostitute Protection Provider");
  }

  return prostituteProtectionContext;
}
