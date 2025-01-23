/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GENDER_VALUES } from "@eshg/lib-portal/components/formFields/constants";
import { isDefined } from "remeda";

import { ChildExamination } from "@/lib/businessModules/dental/api/models/ChildExamination";
import { EXAMINATION_STATUS } from "@/lib/businessModules/dental/features/examinations/translations";
import { displayBoolean } from "@/lib/shared/helpers/booleans";

export interface ParticipantSorting {
  sortKey: ParticipantSortKey;
  sortDirection: ParticipantSortDirection;
}

export type ParticipantSortKey = keyof Omit<
  ChildExamination,
  "childId" | "examinationResult"
>;
export type ParticipantSortDirection = "asc" | "desc";

type ParticipantComparator = (
  a: ChildExamination,
  b: ChildExamination,
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
  ...comparators: ((a: ChildExamination, b: ChildExamination) => number)[]
): ParticipantComparator {
  return function compareInOrder(
    a: ChildExamination,
    b: ChildExamination,
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
    a: ChildExamination,
    b: ChildExamination,
  ): number {
    switch (sortKey) {
      case "dateOfBirth":
        return b.dateOfBirth.getDate() - a.dateOfBirth.getDate();
      case "fluoridationConsent":
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
  a: ChildExamination,
  b: ChildExamination,
  sortDirection: ParticipantSortDirection,
): number {
  const aValue = displayBoolean(a.fluoridationConsent);
  const bValue = displayBoolean(b.fluoridationConsent);

  return compareAndSortEmptyStringToEnd(aValue, bValue, sortDirection);
}

function compareGender(
  a: ChildExamination,
  b: ChildExamination,
  sortDirection: ParticipantSortDirection,
): number {
  const aValue = isDefined(a.gender) ? GENDER_VALUES[a.gender] : "";
  const bValue = isDefined(b.gender) ? GENDER_VALUES[b.gender] : "";

  return compareAndSortEmptyStringToEnd(aValue, bValue, sortDirection);
}

function compareStatus(a: ChildExamination, b: ChildExamination): number {
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
