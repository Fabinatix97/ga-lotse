/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import { GENDER_VALUES } from "@eshg/lib-portal";

import { EXAMINATION_STATUS } from "../../../../translations/examination";
import { formatBooleanWithUnknown } from "../../../../utils/formatters";
import { ProphylaxisSessionExamination } from "../../api/models/ProphylaxisSessionExamination";

export interface ParticipantSorting {
  sortKey: ParticipantSortKey;
  sortDirection: ParticipantSortDirection;
}

type ParticipantSortAttributes = Pick<
  ProphylaxisSessionExamination,
  | "firstName"
  | "lastName"
  | "dateOfBirth"
  | "groupName"
  | "gender"
  | "currentFluoridationConsent"
  | "status"
>;

export type ParticipantSortKey = keyof ParticipantSortAttributes;
type ParticipantSortDirection = "asc" | "desc";

type ParticipantComparator = (
  a: ParticipantSortAttributes,
  b: ParticipantSortAttributes,
) => number;

export function sortParticipants(
  sorting: ParticipantSorting,
  participants: ProphylaxisSessionExamination[],
): ProphylaxisSessionExamination[] {
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
        return a.dateOfBirth.getTime() - b.dateOfBirth.getTime();
      case "currentFluoridationConsent":
        return compareFluoridation(a, b, sortDirection);
      case "gender":
        return compareGender(a, b, sortDirection);
      case "status":
        return compareStatus(a, b);
      case "groupName":
        return compareGroupName(a, b, sortDirection);
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
  const aValue = formatBooleanWithUnknown(
    a.currentFluoridationConsent?.consented,
  );
  const bValue = formatBooleanWithUnknown(
    b.currentFluoridationConsent?.consented,
  );

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

function compareGroupName(
  a: ParticipantSortAttributes,
  b: ParticipantSortAttributes,
  sortDirection: ParticipantSortDirection,
): number {
  const aValue = isDefined(a.groupName) ? a.groupName : "";
  const bValue = isDefined(b.groupName) ? b.groupName : "";

  return compareAndSortEmptyStringToEnd(aValue, bValue, sortDirection);
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
