/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChildExamination } from "@eshg/dental";
import { GENDER_VALUES } from "@eshg/lib-portal/components/formFields/constants";
import { isDefined } from "remeda";

import { EXAMINATION_STATUS } from "@/lib/businessModules/dental/features/examinations/translations";
import { displayBoolean } from "@/lib/shared/helpers/booleans";

export interface ParticipantSorting {
  sortKey: ParticipantSortKey;
  sortDirection: ParticipantSortDirection;
}

type ParticipantSortAttributes = Omit<
  ChildExamination,
  | "childId"
  | "result"
  | "note"
  | "examinationId"
  | "examinationVersion"
  | "allFluoridationConsents"
  | "prophylaxisDentitionType"
  | "previousExaminationResults"
>;
export type ParticipantSortKey = keyof ParticipantSortAttributes;
export type ParticipantSortDirection = "asc" | "desc";

type ParticipantComparator = (
  a: ParticipantSortAttributes,
  b: ParticipantSortAttributes,
) => number;

export function sortParticipants(
  sorting: ParticipantSorting,
  participants: ChildExamination[],
): ChildExamination[] {
  const sortedParticipants = participants.toSorted(
    compareMultiple(
      compareBy(sorting.sortKey, sorting.sortDirection),
      compareBy("lastName", sorting.sortDirection),
      compareBy("firstName", sorting.sortDirection),
    ),
  );
  return sorting.sortDirection === "desc"
    ? sortedParticipants.toReversed()
    : sortedParticipants;
}

function compareMultiple(
  ...comparators: ((
    a: ParticipantSortAttributes,
    b: ParticipantSortAttributes,
  ) => number)[]
): ParticipantComparator {
  return function compareInOrder(
    a: ParticipantSortAttributes,
    b: ParticipantSortAttributes,
  ): number {
    for (const comparator of comparators) {
      const result = comparator(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };
}

function compareBy(
  sortKey: ParticipantSortKey,
  sortDirection: ParticipantSortDirection,
): ParticipantComparator {
  return function compareParticipant(
    a: ParticipantSortAttributes,
    b: ParticipantSortAttributes,
  ): number {
    switch (sortKey) {
      case "dateOfBirth":
        return b.dateOfBirth.getDate() - a.dateOfBirth.getDate();
      case "currentFluoridationConsent":
        return compareFluoridation(a, b, sortDirection);
      case "gender":
        return compareGender(a, b, sortDirection);
      case "status":
        return compareStatus(a, b);
      default:
        return a[sortKey].localeCompare(b[sortKey]);
    }
  };
}

function compareFluoridation(
  a: ParticipantSortAttributes,
  b: ParticipantSortAttributes,
  sortDirection: ParticipantSortDirection,
): number {
  const aValue = displayBoolean(a.currentFluoridationConsent?.consented);
  const bValue = displayBoolean(b.currentFluoridationConsent?.consented);

  return compareAndSortEmptyStringToEnd(aValue, bValue, sortDirection);
}

function compareGender(
  a: ParticipantSortAttributes,
  b: ParticipantSortAttributes,
  sortDirection: ParticipantSortDirection,
): number {
  const aValue = isDefined(a.gender) ? GENDER_VALUES[a.gender] : "";
  const bValue = isDefined(b.gender) ? GENDER_VALUES[b.gender] : "";

  return compareAndSortEmptyStringToEnd(aValue, bValue, sortDirection);
}

function compareStatus(
  a: ParticipantSortAttributes,
  b: ParticipantSortAttributes,
): number {
  const aValue = EXAMINATION_STATUS[a.status];
  const bValue = EXAMINATION_STATUS[b.status];

  return aValue.localeCompare(bValue);
}

function compareAndSortEmptyStringToEnd(
  a: string,
  b: string,
  sortDirection: ParticipantSortDirection,
): number {
  if (a === b) return 0;
  if (a === "") return sortDirection === "asc" ? 1 : -1;
  if (b === "") return sortDirection === "asc" ? -1 : 1;

  return a.localeCompare(b);
}
