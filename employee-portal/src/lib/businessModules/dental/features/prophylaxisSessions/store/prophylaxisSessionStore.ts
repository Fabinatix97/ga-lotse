/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createStore } from "zustand";

import { ProphylaxisSessionDetails } from "@/lib/businessModules/dental/api/models/ProphylaxisSessionDetails";

import { ParticipantFilters } from "./participantFilters";
import { ParticipantSorting } from "./participantSorting";

export interface ProphylaxisSessionState extends ProphylaxisSessionDetails {
  participantFilters: ParticipantFilters;
  participantSorting: ParticipantSorting;
}

export interface ProphylaxisSessionActions {
  setParticipantFilters: (filtersChange: Partial<ParticipantFilters>) => void;
  setParticipantSorting: (sorting: ParticipantSorting) => void;
}

export type ProphylaxisSessionStore = ProphylaxisSessionState &
  ProphylaxisSessionActions;

const initialFilters: ParticipantFilters = {
  gender: "ANY",
  fluoridationConsent: "ANY",
};

const initialSorting: ParticipantSorting = {
  sortKey: "lastName",
  sortDirection: "asc",
};

export function initProphylaxisSessionStore(
  prophylaxisSession: ProphylaxisSessionDetails,
): ProphylaxisSessionState {
  return {
    ...prophylaxisSession,
    participantFilters: initialFilters,
    participantSorting: initialSorting,
  };
}

export function createProphylaxisSessionStore(
  initialState: ProphylaxisSessionState,
) {
  return createStore<ProphylaxisSessionStore>()((set) => ({
    ...initialState,
    setParticipantFilters: (filters) => {
      set((state) => ({
        participantFilters: {
          ...state.participantFilters,
          ...filters,
        },
      }));
    },
    setParticipantSorting: (participantSorting) =>
      set({
        participantSorting,
      }),
  }));
}
