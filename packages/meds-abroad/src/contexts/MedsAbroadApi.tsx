/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ReactNode, createContext, useContext, useRef } from "react";

import { MedsAbroadClients, createClients } from "../api/createClients";

const MedsAbroadContext = createContext<MedsAbroadClients | null>(null);

export function MedsAbroadApiClientProvider({
  children,
  baseUrl,
}: {
  baseUrl: string;
  children: ReactNode;
}) {
  const clients = useRef(createClients(baseUrl));

  return (
    <MedsAbroadContext value={clients.current}>{children}</MedsAbroadContext>
  );
}

export function useMedsAbroadApiClients(): MedsAbroadClients {
  const medsAbroadContext = useContext(MedsAbroadContext);

  if (medsAbroadContext === null) {
    throw new Error("Missing MedsAbroadProvider");
  }

  return medsAbroadContext;
}
