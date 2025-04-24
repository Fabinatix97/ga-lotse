/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createStore } from "zustand";

import { ExaminationResult } from "@/api/models/ExaminationResult";
import { ProphylaxisSessionDetails } from "@/features/prophylaxisSessions/api/models/ProphylaxisSessionDetails";

import { setExamination, setParticipantFilters } from "./actions";
import { ParticipantFilters } from "./participantFilters";
import { ParticipantSorting } from "./participantSorting";

export interface ProphylaxisSessionState extends ProphylaxisSessionDetails {
  participantFilters: ParticipantFilters;
  participantSorting: ParticipantSorting;

  changedExaminationsById: Set<string>;
}

export interface ProphylaxisSessionActions {
  setParticipantFilters: (filtersChange: Partial<ParticipantFilters>) => void;
  setParticipantSorting: (sorting: ParticipantSorting) => void;
  setProphylaxisSession: (
    prophylaxisSession: ProphylaxisSessionDetails,
  ) => void;
  setExamination: (
    examinationId: string,
    result: ExaminationResult | undefined,
    note: string | undefined,
  ) => void;

  markAsSynchronized: () => void;
}

export type ProphylaxisSessionStore = ProphylaxisSessionState &
  ProphylaxisSessionActions;

const initialFilters: ParticipantFilters = {
  gender: "ANY",
  fluoridationConsentGiven: "ANY",
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

    changedExaminationsById: new Set(),
  };
}

export function createProphylaxisSessionStore(
  initialState: ProphylaxisSessionState,
) {
  return createStore<ProphylaxisSessionStore>()((set) => ({
    ...initialState,
    setParticipantFilters: (filters) => {
      set((state) => setParticipantFilters(filters, state));
    },
    setParticipantSorting: (participantSorting) => set({ participantSorting }),
    setProphylaxisSession: (prophylaxisSession) => set(prophylaxisSession),
    setExamination: (
      examinationId: string,
      result: ExaminationResult | undefined,
      note: string | undefined,
    ) => set((state) => setExamination(examinationId, result, note, state)),

    markAsSynchronized: () => set({ changedExaminationsById: new Set() }),
  }));
}
