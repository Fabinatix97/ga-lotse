/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  getAllDentalAssistantsQuery,
  getAllDentistsQuery,
} from "@eshg/dental/api/queries/staffApi";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useUserApi } from "@/lib/baseModule/api/clients";

export function useGetStaff() {
  const userApi = useUserApi();
  const [{ data: allDentists }, { data: allDentalAssistants }] =
    useSuspenseQueries({
      queries: [
        getAllDentistsQuery(userApi),
        getAllDentalAssistantsQuery(userApi),
      ],
    });

  return { allDentists, allDentalAssistants };
}
