/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { ProphylaxisSessionDetails } from "@/features/prophylaxisSessions/api/models/ProphylaxisSessionDetails";
import { ProphylaxisSessionExamination } from "@/features/prophylaxisSessions/api/models/ProphylaxisSessionExamination";

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
    <ProphylaxisSessionStoreContext value={store}>
      {children}
    </ProphylaxisSessionStoreContext>
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

export function useFilteredParticipants(): ProphylaxisSessionExamination[] {
  return useProphylaxisSessionStore(
    useShallow((state) =>
      sortParticipants(
        state.participantSorting,
        filterParticipants(state.participantFilters, state.participants),
      ),
    ),
  );
}

export function useFilteredPresentParticipants(): ProphylaxisSessionExamination[] {
  return useFilteredParticipants().filter(
    (participant) => participant.status !== "NOT_PRESENT",
  );
}
