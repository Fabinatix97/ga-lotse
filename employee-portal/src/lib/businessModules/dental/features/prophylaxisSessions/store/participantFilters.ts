/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChildExamination } from "@eshg/dental/api/models/ChildExamination";

export interface ParticipantFilters {
  gender: GenderFilter;
  fluoridationConsent: FluoridationConsentFilter;
}

export type GenderFilter = "MALE" | "FEMALE" | "ANY";
export type FluoridationConsentFilter = "YES" | "NO" | "ANY";

export function filterParticipants(
  filters: ParticipantFilters,
  participants: ChildExamination[],
): ChildExamination[] {
  return participants.filter(
    (participant) =>
      matchesGender(participant, filters.gender) &&
      matchesFluoridationConsent(participant, filters.fluoridationConsent),
  );
}

function matchesGender(
  participant: ChildExamination,
  filter: GenderFilter,
): boolean {
  if (filter === "ANY") {
    return true;
  }

  return participant.gender === filter;
}

function matchesFluoridationConsent(
  participant: ChildExamination,
  filter: FluoridationConsentFilter,
): boolean {
  if (filter === "ANY") {
    return true;
  }

  const requiresConsent = filter === "YES";
  return participant.fluoridationConsent === requiresConsent;
}
