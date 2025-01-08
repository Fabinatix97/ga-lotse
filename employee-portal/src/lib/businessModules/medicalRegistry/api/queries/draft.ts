/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferenceFacilityResponse } from "@eshg/employee-portal-api/base";
import {
  ApiGetProcedureDraftResponse,
  ApiGetReferencePersonResponse,
  ApiMedicalRegistryEntrySearchResult,
  ApiMedicalRegistryEntrySearchResultFromJSON,
  ApiProcedureStatus,
} from "@eshg/employee-portal-api/medicalRegistry";
import { useQuery } from "@tanstack/react-query";
import { isDefined, mapValues } from "remeda";

import { useFacilityApi } from "@/lib/baseModule/api/clients";
import { useProcedureApi } from "@/lib/businessModules/medicalRegistry/api/clients";
import { medicalRegistryApiQueryKey } from "@/lib/businessModules/medicalRegistry/api/queries/apiQueryKeys";

export interface ReferencePersonWithProcedures
  extends ApiGetReferencePersonResponse {
  procedures: ApiMedicalRegistryEntrySearchResult[];
}

export interface SearchDraftReferencesResponse {
  persons: ReferencePersonWithProcedures[];
  facilities: ApiGetReferenceFacilityResponse[];
}

export function useSearchDraftReferences(
  procedure: ApiGetProcedureDraftResponse,
  options: { includePersonsWithoutProcedures: boolean },
) {
  const facilityApi = useFacilityApi();
  const procedureApi = useProcedureApi();

  const { applicant, practices } = procedure;
  const practiceName = practices?.[0]?.name;

  return useQuery<SearchDraftReferencesResponse>({
    queryKey: medicalRegistryApiQueryKey([
      "searchDraftReferences",
      applicant.firstName,
      applicant.lastName,
      applicant.nameAtBirth,
      applicant.dateOfBirth,
      practiceName,
    ]),
    queryFn: async () => {
      const [
        personsByLastNameResponse,
        personsByNameAtBirthResponse,
        facilitiesResponse,
      ] = await Promise.all([
        procedureApi.searchProceduresByPerson(
          applicant.firstName,
          applicant.lastName,
          applicant.dateOfBirth,
        ),
        isDefined(applicant.nameAtBirth) &&
        applicant.lastName !== applicant.nameAtBirth
          ? procedureApi.searchProceduresByPerson(
              applicant.firstName,
              applicant.nameAtBirth,
              applicant.dateOfBirth,
            )
          : undefined,
        isDefined(practiceName)
          ? facilityApi.searchReferenceFacilities(practiceName)
          : undefined,
      ]);

      const proceduresByPerson = mapValues(
        {
          ...personsByNameAtBirthResponse?.procedures,
          ...personsByLastNameResponse.procedures,
        },
        // openapi-generator does not map procedure array
        (procedures) => procedures.map(mapProcedure),
      );

      const persons = Object.values({
        ...personsByNameAtBirthResponse?.resolvedPersons,
        ...personsByLastNameResponse.resolvedPersons,
      })
        .map(
          (person): ReferencePersonWithProcedures => ({
            ...person,
            procedures: filterProceduresByStatusOpen(
              proceduresByPerson[person.id],
            ),
          }),
        )
        .filter(
          (person) =>
            options.includePersonsWithoutProcedures ||
            person.procedures.length !== 0,
        )
        .toSorted((a, b) => b.lastName.localeCompare(a.lastName, "de"));

      return {
        persons,
        facilities: facilitiesResponse?.facilities ?? [],
      };
    },
    // query is intended to be trigger using refetch
    enabled: false,
  });
}

function filterProceduresByStatusOpen(
  procedures: ApiMedicalRegistryEntrySearchResult[] | undefined,
): ApiMedicalRegistryEntrySearchResult[] {
  if (procedures === undefined) {
    return [];
  }

  return procedures.filter(
    (procedure) => procedure.status === ApiProcedureStatus.Open,
  );
}

function mapProcedure(
  procedure: ApiMedicalRegistryEntrySearchResult,
): ApiMedicalRegistryEntrySearchResult {
  return typeof procedure.created === "string"
    ? ApiMedicalRegistryEntrySearchResultFromJSON(procedure)
    : procedure;
}
