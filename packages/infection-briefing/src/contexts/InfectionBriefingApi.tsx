/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ReactNode, createContext, useContext, useRef } from "react";

const InfectionBriefingContext = createContext<string | null>(null);

export function InfectionBriefingApiClientProvider({
  children,
  baseUrl,
}: {
  baseUrl: string;
  children: ReactNode;
}) {
  const clients = useRef(baseUrl);

  return (
    <InfectionBriefingContext value={clients.current}>
      {children}
    </InfectionBriefingContext>
  );
}

export function useInfectionBriefingApiClients() {
  const infectionBriefingContext = useContext(InfectionBriefingContext);

  if (infectionBriefingContext === null) {
    throw new Error("Missing Infection Briefing Provider");
  }

  return infectionBriefingContext;
}
