/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { ChildExamination } from "@/lib/businessModules/dental/api/models/ChildExamination";
import { ProphylaxisSessionDetails } from "@/lib/businessModules/dental/api/models/ProphylaxisSessionDetails";

import { filterParticipants } from "./participantFilters";
import { sortParticipants } from "./participantSorting";
import {
  type ProphylaxisSessionStore,
  createProphylaxisSessionStore,
  initProphylaxisSessionStore,
} from "./prophylaxisSessionStore";

type ProphylaxisSessionStoreApi = ReturnType<
  typeof createProphylaxisSessionStore
>;

const ProphylaxisSessionStoreContext =
  createContext<ProphylaxisSessionStoreApi | null>(null);

interface ProphylaxisSessionStoreProviderProps extends RequiresChildren {
  prophylaxisSession: ProphylaxisSessionDetails;
}

export function ProphylaxisSessionStoreProvider({
  prophylaxisSession,
  children,
}: ProphylaxisSessionStoreProviderProps) {
  const [store] = useState(() =>
    createProphylaxisSessionStore(
      initProphylaxisSessionStore(prophylaxisSession),
    ),
  );

  const { setState } = store;
  useEffect(() => {
    setState(prophylaxisSession);
  }, [prophylaxisSession, setState]);

  return (
    <ProphylaxisSessionStoreContext.Provider value={store}>
      {children}
    </ProphylaxisSessionStoreContext.Provider>
  );
}

export function useProphylaxisSessionStore<T>(
  selector: (store: ProphylaxisSessionStore) => T,
): T {
  const prophylaxisSessionStoreContext = useContext(
    ProphylaxisSessionStoreContext,
  );

  if (prophylaxisSessionStoreContext === null) {
    throw new Error("Missing ProphylaxisSessionStoreProvider");
  }

  return useStore(prophylaxisSessionStoreContext, selector);
}

export function useFilteredParticipants(): ChildExamination[] {
  return useProphylaxisSessionStore(
    useShallow((state) =>
      sortParticipants(
        state.participantSorting,
        filterParticipants(state.participantFilters, state.participants),
      ),
    ),
  );
}
