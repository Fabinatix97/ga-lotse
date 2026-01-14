/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PropsWithChildren, createContext, useContext } from "react";

import { ApiCitizenProcedure } from "@eshg/sti-protection-api";

const CitizenProcedureContext = createContext<ApiCitizenProcedure | null>(null);

export function CitizenProcedureProvider({
  data,
  children,
}: PropsWithChildren<{
  data: ApiCitizenProcedure;
}>) {
  return (
    <CitizenProcedureContext value={data}>{children}</CitizenProcedureContext>
  );
}

export function useCitizenProcedure() {
  const context = useContext(CitizenProcedureContext);
  if (!context) {
    throw new Error(
      "useCitizenProcedure must be used with a CitizenProcedureProvider",
    );
  }
  return context;
}
