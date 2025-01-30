/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExaminationResult } from "@eshg/dental/api/models/ExaminationResult";
import { ProphylaxisSessionDetails } from "@eshg/dental/api/models/ProphylaxisSessionDetails";
import { createStore } from "zustand";

import { ParticipantFilters } from "./participantFilters";
import { ParticipantSorting } from "./participantSorting";
import { replaceExaminationResult } from "./replaceExaminationResult";

export interface ProphylaxisSessionState extends ProphylaxisSessionDetails {
  participantFilters: ParticipantFilters;
  participantSorting: ParticipantSorting;
}

export interface ProphylaxisSessionActions {
  setParticipantFilters: (filtersChange: Partial<ParticipantFilters>) => void;
  setParticipantSorting: (sorting: ParticipantSorting) => void;
  setExaminationResult: (
    participantId: string,
    examinationResult: ExaminationResult,
  ) => void;
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
    setExaminationResult: (
      participantId: string,
      examinationResult: ExaminationResult,
    ) =>
      set((state) => ({
        participants: replaceExaminationResult(
          participantId,
          examinationResult,
          state.participants,
        ),
      })),
  }));
}
