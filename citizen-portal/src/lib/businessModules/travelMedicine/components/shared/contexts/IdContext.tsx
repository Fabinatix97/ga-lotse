/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { useSearchParams } from "next/navigation";
import { createContext, useContext } from "react";

interface IdContextProps {
  procedureId: string;
  procedureStepId: string;
}

export const IdContext = createContext<IdContextProps | null>(null);

type IdContextProviderProps = RequiresChildren;

export function IdContextProvider(props: Readonly<IdContextProviderProps>) {
  const searchParams = useSearchParams();
  const procedureId = searchParams.get("procedureId")!;
  const procedureStepId = searchParams.get("procedureStepId")!;

  return (
    <IdContext.Provider value={{ procedureId, procedureStepId }}>
      {props.children}
    </IdContext.Provider>
  );
}

export function useIdContext() {
  const context = useContext(IdContext);
  if (!context) {
    throw new Error("useIdContext must be used with a IdProvider");
  }
  return context;
}
