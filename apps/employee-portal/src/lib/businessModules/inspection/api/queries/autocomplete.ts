/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery } from "@tanstack/react-query";

import { useParameterAutocompleteApi } from "@/lib/businessModules/inspection/api/clients";
import { measurementParameterApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

export function useAutocompleteParameterQuery({ prefix }: { prefix: string }) {
  const parameterAutocompleteApi = useParameterAutocompleteApi();

  return useQuery({
    queryFn: async () => {
      return parameterAutocompleteApi.autocompleteParameter(prefix);
    },
    queryKey: measurementParameterApiQueryKey([
      "autocompleteParameter",
      prefix,
    ]),
  });
}
