/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureDetails } from "@eshg/prostitute-protection-api";

import { useSelectedPerson } from "./SelectedPersonStoreProvider";

export interface PersonDataFromStore {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
}

/**
 * Hook that returns person data from the store if the procedure ID matches,
 * otherwise falls back to the procedure data.
 *
 * This is used to display sensitive person data (firstName, lastName, dateOfBirth)
 * that comes from the person search table instead of from the procedure API.
 *
 * @param procedure - The procedure details from the API
 * @returns Person data with firstName, lastName, and dateOfBirth
 */
export function usePersonDataFromStore(
  procedure: ApiProcedureDetails,
): PersonDataFromStore {
  const selectedPerson = useSelectedPerson();

  // If store has data and IDs match, use store data
  if (selectedPerson.id === procedure.id && selectedPerson.id !== "") {
    return {
      firstName: selectedPerson.firstName,
      lastName: selectedPerson.lastName,
      dateOfBirth: selectedPerson.dateOfBirth,
    };
  }

  // Otherwise, fall back to procedure data
  return {
    firstName: procedure.firstName,
    lastName: procedure.lastName,
    dateOfBirth: procedure.dateOfBirth,
  };
}
