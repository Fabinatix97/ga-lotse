/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiDentitionType } from "@eshg/dental-api";
import { ExaminationResult } from "@eshg/dental/api/models/ExaminationResult";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";

import {
  DentalExaminationStore,
  createDentalExaminationStore,
  initDentalExaminationStore,
} from "./dentalExaminationStore";

type DentalExaminationStoreApi = ReturnType<
  typeof createDentalExaminationStore
>;

const DentalExaminationStoreContext =
  createContext<DentalExaminationStoreApi | null>(null);

interface DentalExaminationStoreProviderProps extends RequiresChildren {
  examinationResult?: ExaminationResult;
  defaultDentitionType?: ApiDentitionType;
  previousExaminationResult?: ExaminationResult;
}

export function DentalExaminationStoreProvider({
  examinationResult,
  defaultDentitionType,
  previousExaminationResult,
  children,
}: DentalExaminationStoreProviderProps) {
  const [store] = useState(() =>
    createDentalExaminationStore(
      initDentalExaminationStore(
        examinationResult,
        defaultDentitionType,
        previousExaminationResult,
      ),
    ),
  );

  // TODO: handle updated examinationResult

  return (
    <DentalExaminationStoreContext.Provider value={store}>
      {children}
    </DentalExaminationStoreContext.Provider>
  );
}

export function useDentalExaminationStore<T>(
  selector: (store: DentalExaminationStore) => T,
): T {
  const dentalExaminationStoreContext = useContext(
    DentalExaminationStoreContext,
  );

  if (dentalExaminationStoreContext === null) {
    throw new Error("Missing DentalExaminationStoreProvider");
  }

  return useStore(dentalExaminationStoreContext, selector);
}
