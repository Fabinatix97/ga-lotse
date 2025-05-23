/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createStore } from "zustand";

import { ExaminationResult } from "../../../../api/models/ExaminationResult";
import { ProphylaxisSessionDetails } from "../../api/models/ProphylaxisSessionDetails";
import {
  ParticipantDetails,
  ProphylaxisSessionExamination,
} from "../../api/models/ProphylaxisSessionExamination";

import {
  getParticipantsToBeExamined,
  setExamination,
  setParticipantDetails,
  setParticipantFilters,
  setParticipantSorting,
  setProphylaxisSession,
} from "./actions";
import { ParticipantFilters } from "./participantFilters";
import { ParticipantSorting } from "./participantSorting";

export interface ProphylaxisSessionState extends ProphylaxisSessionDetails {
  participantFilters: ParticipantFilters;
  participantSorting: ParticipantSorting;
  participantsToBeExamined: ProphylaxisSessionExamination[];

  changedExaminationsById: Set<string>;
  changedParticipantDetailsById: Set<string>;
}

interface ProphylaxisSessionActions {
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
  setParticipantDetails: (participantDetails: ParticipantDetails) => void;
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
    participantsToBeExamined: getParticipantsToBeExamined(
      initialFilters,
      initialSorting,
      prophylaxisSession.participants,
    ),

    changedExaminationsById: new Set(),
    changedParticipantDetailsById: new Set(),
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
    setParticipantSorting: (participantSorting) =>
      set((state) => setParticipantSorting(participantSorting, state)),
    setProphylaxisSession: (prophylaxisSession) =>
      set((state) => setProphylaxisSession(prophylaxisSession, state)),
    setExamination: (
      examinationId: string,
      result: ExaminationResult | undefined,
      note: string | undefined,
    ) => set((state) => setExamination(examinationId, result, note, state)),
    setParticipantDetails: (participantDetails: ParticipantDetails) =>
      set((state) => setParticipantDetails(participantDetails, state)),
  }));
}
