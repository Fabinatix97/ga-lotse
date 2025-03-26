/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ProphylaxisSessionExamination } from "@eshg/dental";

export interface ParticipantFilters {
  gender: GenderFilter;
  fluoridationConsentGiven: FluoridationConsentFilter;
}

export type GenderFilter = "MALE" | "FEMALE" | "ANY";
export type FluoridationConsentFilter = "YES" | "NO" | "ANY";

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

  return participant.gender === filter;
}

function matchesFluoridationConsent(
  participant: ProphylaxisSessionExamination,
  filter: FluoridationConsentFilter,
): boolean {
  if (filter === "ANY") {
    return true;
  }

  const requiresConsent = filter === "YES";
  return participant.currentFluoridationConsent?.consented === requiresConsent;
}
