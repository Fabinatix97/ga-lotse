/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetUsersByGroupQuery } from "@eshg/lib-employee-portal";

import { DentalUserGroup } from "@/config/userGroups";

export function useGetStaff() {
  const getAllDentistsQuery = useGetUsersByGroupQuery(DentalUserGroup.Dentist);
  const getAllDentalAssistantsQuery = useGetUsersByGroupQuery(
    DentalUserGroup.DentalAssistant,
  );

  const [{ data: allDentists }, { data: allDentalAssistants }] =
    useSuspenseQueries({
      queries: [getAllDentistsQuery, getAllDentalAssistantsQuery],
    });

  return { allDentists, allDentalAssistants };
}
