/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ChildExamination, ProphylaxisSessionDetails } from "@eshg/dental";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { filterParticipants } from "./participantFilters";
import { sortParticipants } from "./participantSorting";
import {
  type ProphylaxisSessionStore,
  createProphylaxisSessionStore,
  initProphylaxisSessionStore,
} from "./prophylaxisSessionStore";
import { useSyncIncomingProphylaxisSessionChanges } from "./useSyncIncomingProphylaxisSessionChanges";

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

  useSyncIncomingProphylaxisSessionChanges(store, prophylaxisSession);

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

export function useFilteredPresentParticipants(): ChildExamination[] {
  return useFilteredParticipants().filter(
    (participant) => participant.status !== "NOT_PRESENT",
  );
}
