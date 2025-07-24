/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import { ApiFluoridationConsent } from "@eshg/dental-api";

import { ExaminationResult } from "../../../../api/models/ExaminationResult";
import { mapToExaminationStatus } from "../../../../api/models/ExaminationStatus";
import { ProphylaxisSessionDetails } from "../../api/models/ProphylaxisSessionDetails";
import {
  ParticipantDetails,
  ProphylaxisSessionExamination,
} from "../../api/models/ProphylaxisSessionExamination";

import { ParticipantFilters, filterParticipants } from "./participantFilters";
import { ParticipantSorting, sortParticipants } from "./participantSorting";
import { ProphylaxisSessionState } from "./prophylaxisSessionStore";

type SetParticipantFilterAndSortingState = Pick<
  ProphylaxisSessionState,
  "participantFilters" | "participantSorting" | "participants"
>;

type ParticipantSortingState = Pick<
  ProphylaxisSessionState,
  "participantSorting" | "participantsToBeExamined"
>;

export function setParticipantSorting(
  sorting: ParticipantSorting,
  state: SetParticipantFilterAndSortingState,
): ParticipantSortingState {
  const participantSorting = {
    ...state.participantSorting,
    ...sorting,
  };
  return {
    participantSorting,
    participantsToBeExamined: getParticipantsToBeExamined(
      state.participantFilters,
      participantSorting,
      state.participants,
    ),
  };
}

type ParticipantFilterState = Pick<
  ProphylaxisSessionState,
  "participantFilters" | "participantsToBeExamined"
>;

export function setParticipantFilters(
  filters: Partial<ParticipantFilters>,
  state: SetParticipantFilterAndSortingState,
): ParticipantFilterState {
  const participantFilters = {
    ...state.participantFilters,
    ...filters,
  };
  return {
    participantFilters,
    participantsToBeExamined: getParticipantsToBeExamined(
      participantFilters,
      state.participantSorting,
      state.participants,
    ),
  };
}

export function getParticipantsToBeExamined(
  filter: ParticipantFilters,
  sorting: ParticipantSorting,
  participants: ProphylaxisSessionExamination[],
  filterAbsent = true,
): ProphylaxisSessionExamination[] {
  const participantsToBeExamined = sortParticipants(
    sorting,
    filterParticipants(filter, participants),
  );
  if (filterAbsent) {
    return participantsToBeExamined.filter((p) => p.status !== "NOT_PRESENT");
  }
  return participantsToBeExamined;
}

type SetExaminationState = Pick<
  ProphylaxisSessionState,
  "participants" | "participantsToBeExamined" | "changedExaminationsById"
>;

type SetExaminationInputState = Pick<
  ProphylaxisSessionState,
  | "participants"
  | "participantsToBeExamined"
  | "changedExaminationsById"
  | "isScreening"
  | "fluoridationVarnish"
>;

export function setExamination(
  examinationId: string,
  result: ExaminationResult | undefined,
  note: string | undefined,
  state: SetExaminationInputState,
): SetExaminationState {
  function updateParticipants(participants: ProphylaxisSessionExamination[]) {
    return participants.map((participant) => {
      if (participant.examinationId !== examinationId) {
        return participant;
      }

      const status = mapToExaminationStatus(result, {
        isScreening: state.isScreening,
        isFluoridation: isDefined(state.fluoridationVarnish),
        isFluoridationConsentGiven:
          participant.currentFluoridationConsent?.consented,
      });

      return {
        ...participant,
        status,
        result,
        note,
      };
    });
  }

  const updatedParticipants = updateParticipants(state.participants);
  const updatedParticipantsToBeExamined = updateParticipants(
    state.participantsToBeExamined,
  );

  return {
    participants: updatedParticipants,
    participantsToBeExamined: updatedParticipantsToBeExamined,
    changedExaminationsById: new Set(state.changedExaminationsById).add(
      examinationId,
    ),
  };
}

export function setExaminations(
  examinationIds: string[],
  result: ExaminationResult | undefined,
  state: SetExaminationInputState,
): SetExaminationState {
  function updateParticipants(participants: ProphylaxisSessionExamination[]) {
    return participants.map((participant) => {
      if (!examinationIds.includes(participant.examinationId)) {
        return participant;
      }

      const status = mapToExaminationStatus(result, {
        isScreening: state.isScreening,
        isFluoridation: isDefined(state.fluoridationVarnish),
        isFluoridationConsentGiven:
          participant.currentFluoridationConsent?.consented,
      });

      return {
        ...participant,
        status,
        result,
      };
    });
  }

  const updatedParticipants = updateParticipants(state.participants);
  const updatedParticipantsToBeExamined = updateParticipants(
    state.participantsToBeExamined,
  );

  return {
    participants: updatedParticipants,
    participantsToBeExamined: updatedParticipantsToBeExamined,
    changedExaminationsById: new Set([
      ...state.changedExaminationsById,
      ...examinationIds,
    ]),
  };
}

type SetParticipantDetailsState = Pick<
  ProphylaxisSessionState,
  "participants" | "participantsToBeExamined" | "changedParticipantDetailsById"
>;

export function setParticipantDetails(
  participantDetails: ParticipantDetails,
  state: SetParticipantDetailsState,
): SetParticipantDetailsState {
  const updatedParticipants = updateParticipants(
    state.participants,
    participantDetails,
  );
  const updatedParticipantsToBeExamined = updateParticipants(
    state.participantsToBeExamined,
    participantDetails,
  );

  return {
    participants: updatedParticipants,
    participantsToBeExamined: updatedParticipantsToBeExamined,
    changedParticipantDetailsById: new Set(
      state.changedParticipantDetailsById,
    ).add(participantDetails.id),
  };
}

function updateParticipants(
  participants: ProphylaxisSessionExamination[],
  participantDetails: ParticipantDetails,
) {
  return participants.map((participant) => {
    if (participant.id !== participantDetails.id) {
      return participant;
    }

    const allFluoridationConsents = addFluoridationConsentSorted(
      participant,
      participantDetails.currentFluoridationConsent,
    );

    return {
      ...participant,
      ...participantDetails,
      allFluoridationConsents,
      currentFluoridationConsent: allFluoridationConsents[0],
      participantDetails,
    };
  });
}

function addFluoridationConsentSorted(
  participant: ProphylaxisSessionExamination,
  updatedFluoridationConsent: ApiFluoridationConsent | undefined,
): ApiFluoridationConsent[] {
  if (
    isDefined(updatedFluoridationConsent) &&
    participant.currentFluoridationConsent !== updatedFluoridationConsent
  ) {
    return [
      updatedFluoridationConsent,
      ...participant.allFluoridationConsents,
    ].sort((a, b) => b.dateOfConsent.getTime() - a.dateOfConsent.getTime());
  }

  return participant.allFluoridationConsents;
}
type SetProphylaxisSessionState = Pick<
  ProphylaxisSessionState,
  "participantFilters" | "participantSorting"
>;

type SetProphylaxisSessionResult = ProphylaxisSessionDetails &
  Pick<
    ProphylaxisSessionState,
    | "participantsToBeExamined"
    | "changedExaminationsById"
    | "changedParticipantDetailsById"
  >;

export function setProphylaxisSession(
  prophylaxisSession: ProphylaxisSessionDetails,
  state: SetProphylaxisSessionState,
): SetProphylaxisSessionResult {
  return {
    ...prophylaxisSession,
    participantsToBeExamined: getParticipantsToBeExamined(
      state.participantFilters,
      state.participantSorting,
      prophylaxisSession.participants,
      true,
    ),
    changedExaminationsById: new Set(),
    changedParticipantDetailsById: new Set(),
  };
}
