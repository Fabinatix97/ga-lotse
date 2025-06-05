/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined, isNullish, mapValues } from "remeda";

import {
  ApiEmployeeChoice,
  ApiEmployeeChoiceFromJSON,
  ApiGetConfirmInfoResponse,
  ApiGetReferenceFacilityResponse,
  ApiGetReferencePersonResponse,
  ApiMedicalRegistryEntrySearchResult,
  ApiMedicalRegistryEntrySearchResultFromJSON,
  ApiPersonCandidate,
  ApiResolvedEmployeeChange,
} from "@eshg/medical-registry-api";

export interface DraftConfirmInfo {
  persons: ApiGetReferencePersonResponse[];
  facilities: ApiGetReferenceFacilityResponse[];
  employeeChoicesByProcedure: Record<string, GroupedEmployeeChoices>;
  proceduresByPerson: Record<string, ApiMedicalRegistryEntrySearchResult[]>;
}

export interface PersonCandidate extends ApiPersonCandidate {
  entryId: string;
  isNoMatchChoice: boolean;
}

export interface EmployeeChoice
  extends Omit<ApiEmployeeChoice, "personCandidates"> {
  personCandidates: PersonCandidate[];
}

export interface GroupedEmployeeChoices {
  resolvedEmployeeChoices: ApiResolvedEmployeeChange[];
  openEmployeeChoices: EmployeeChoice[];
}

export function mapConfirmInfoResponse(
  confirmInfoResponse: ApiGetConfirmInfoResponse,
): DraftConfirmInfo {
  const employeeChoicesByProcedure = mapValues(
    confirmInfoResponse.employeeChoicesByProcedure ?? {},
    // openapi-generator does not map records of arrays
    (employeeChoices) =>
      mapToGroupedEmployeeChoices(
        employeeChoices.map(mapEmployeeChoiceFromJSON).map(mapEmployeeChoice),
      ),
  );
  const proceduresByPerson = mapValues(
    confirmInfoResponse.proceduresByReferencePerson ?? {},
    // openapi-generator does not map records of arrays
    (procedures) => procedures.map(mapProcedureFromJSON),
  );

  const facilities = confirmInfoResponse.matchingReferenceFacilities ?? [];
  const persons = (confirmInfoResponse.matchingReferencePersons ?? []).toSorted(
    (a, b) => b.lastName.localeCompare(a.lastName, "de"),
  );

  return {
    persons,
    facilities,
    employeeChoicesByProcedure,
    proceduresByPerson,
  };
}

function mapToGroupedEmployeeChoices(
  employeeChoices: EmployeeChoice[],
): GroupedEmployeeChoices {
  const resolvedEmployeeChoices: ApiResolvedEmployeeChange[] = [];
  const openEmployeeChoices: EmployeeChoice[] = [];
  for (const employeeChoice of employeeChoices) {
    const { employeeChange, personCandidates } = employeeChoice;
    const personCandidate = personCandidates[0];

    // automatically resolve employee choices with only one option
    if (isDefined(personCandidate) && personCandidates.length === 1) {
      resolvedEmployeeChoices.push(
        mapToResolvedEmployeeChange(
          employeeChange.employeeChangeId,
          personCandidate,
        ),
      );
    } else {
      openEmployeeChoices.push(employeeChoice);
    }
  }

  return { resolvedEmployeeChoices, openEmployeeChoices };
}

function mapEmployeeChoice({
  employeeChange,
  personCandidates,
}: ApiEmployeeChoice) {
  return {
    employeeChange,
    personCandidates: personCandidates.map(mapPersonCandidate),
  };
}

export function mapToResolvedEmployeeChange(
  employeeChangeId: string,
  personCandidate: PersonCandidate,
): ApiResolvedEmployeeChange {
  return {
    employeeChangeId,
    dateOfBirth: personCandidate.dateOfBirth,
    firstName: personCandidate.firstName,
    lastName: personCandidate.lastName,
    employeeId: personCandidate.employeeId,
    referencePersonId: personCandidate.referencePersonId,
  };
}

function mapPersonCandidate(
  personCandidate: ApiPersonCandidate,
  index: number,
): PersonCandidate {
  const isNoMatchChoice = isNullish(personCandidate.referencePersonId);
  return { ...personCandidate, isNoMatchChoice, entryId: index.toString() };
}

function mapProcedureFromJSON(
  procedure: ApiMedicalRegistryEntrySearchResult,
): ApiMedicalRegistryEntrySearchResult {
  return typeof procedure.created === "string"
    ? ApiMedicalRegistryEntrySearchResultFromJSON(procedure)
    : procedure;
}

function mapEmployeeChoiceFromJSON(
  employeeChoice: ApiEmployeeChoice,
): ApiEmployeeChoice {
  return typeof employeeChoice.employeeChange.dateOfBirth === "string"
    ? ApiEmployeeChoiceFromJSON(employeeChoice)
    : employeeChoice;
}
