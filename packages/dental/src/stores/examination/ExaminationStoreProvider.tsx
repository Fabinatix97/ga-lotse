/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";

import { ApiDentitionType } from "@eshg/dental-api";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import {
  ExaminationResult,
  ExaminationResultWithDate,
} from "@/api/models/ExaminationResult";

import {
  ExaminationStore,
  createExaminationStore,
  initExaminationStore,
} from "./examinationStore";

type ExaminationStoreApi = ReturnType<typeof createExaminationStore>;

const ExaminationStoreContext = createContext<ExaminationStoreApi | null>(null);

interface ExaminationStoreProviderProps extends RequiresChildren {
  examinationResult?: ExaminationResult;
  defaultDentitionType?: ApiDentitionType;
  previousExaminationResult?: ExaminationResultWithDate;
}

export function ExaminationStoreProvider({
  examinationResult,
  defaultDentitionType,
  previousExaminationResult,
  children,
}: ExaminationStoreProviderProps) {
  const [store] = useState(() =>
    createExaminationStore(
      initExaminationStore(
        examinationResult,
        defaultDentitionType,
        previousExaminationResult,
      ),
    ),
  );

  // TODO: handle updated examinationResult

  return (
    <ExaminationStoreContext value={store}>{children}</ExaminationStoreContext>
  );
}

export function useExaminationStore<T>(
  selector: (store: ExaminationStore) => T,
): T {
  const examinationStoreContext = useContext(ExaminationStoreContext);

  if (examinationStoreContext === null) {
    throw new Error("Missing ExaminationStoreProvider");
  }

  return useStore(examinationStoreContext, selector);
}
