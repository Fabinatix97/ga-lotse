/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExaminationResult, mapToExaminationStatus } from "@eshg/dental";

import { ParticipantFilters } from "./participantFilters";
import { ProphylaxisSessionState } from "./prophylaxisSessionStore";

type SetParticipantFiltersState = Pick<
  ProphylaxisSessionState,
  "participantFilters"
>;

export function setParticipantFilters(
  filters: Partial<ParticipantFilters>,
  state: SetParticipantFiltersState,
): SetParticipantFiltersState {
  return {
    participantFilters: {
      ...state.participantFilters,
      ...filters,
    },
  };
}

type SetExaminationState = Pick<
  ProphylaxisSessionState,
  "participants" | "changedExaminationsById"
>;

export function setExamination(
  examinationId: string,
  result: ExaminationResult | undefined,
  note: string | undefined,
  state: SetExaminationState,
): SetExaminationState {
  const updatedParticipants = state.participants.map((participant) => {
    if (participant.examinationId !== examinationId) {
      return participant;
    }

    const status = mapToExaminationStatus(result);

    return {
      ...participant,
      status,
      result,
      note,
    };
  });

  return {
    participants: updatedParticipants,
    changedExaminationsById: new Set(state.changedExaminationsById).add(
      examinationId,
    ),
  };
}
