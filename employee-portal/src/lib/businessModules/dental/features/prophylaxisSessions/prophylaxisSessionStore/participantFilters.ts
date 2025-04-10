/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ProphylaxisSessionExamination } from "@eshg/dental";

export interface ParticipantFilters {
  gender: GenderFilter;
  fluoridationConsentGiven: FluoridationConsentFilter;
}

export type GenderFilter = "MALE" | "FEMALE" | "ANY" | "OTHER";
export type FluoridationConsentFilter = "YES" | "NO" | "ANY" | "NOT_AVAILABLE";

export function filterParticipants(
  filters: ParticipantFilters,
  participants: ProphylaxisSessionExamination[],
): ProphylaxisSessionExamination[] {
  return participants.filter(
    (participant) =>
      matchesGender(participant, filters.gender) &&
      matchesFluoridationConsent(participant, filters.fluoridationConsentGiven),
  );
}

function matchesGender(
  participant: ProphylaxisSessionExamination,
  filter: GenderFilter,
): boolean {
  if (filter === "ANY") {
    return true;
  }
  if (filter === "OTHER") {
    return (
      participant.gender === "NOT_SPECIFIED" ||
      participant.gender === "DIVERSE" ||
      participant.gender === undefined
    );
  }

  return participant.gender === filter;
}

function matchesFluoridationConsent(
  participant: ProphylaxisSessionExamination,
  filter: FluoridationConsentFilter,
): boolean {
  if (filter === "ANY") {
    return true;
  }

  if (filter === "NOT_AVAILABLE") {
    return participant.currentFluoridationConsent === undefined;
  }

  const requiresConsent = filter === "YES";
  return participant.currentFluoridationConsent?.consented === requiresConsent;
}
