/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useLabelApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { mapLabels } from "@/lib/businessModules/schoolEntry/api/models/Label";
import { schoolEntryApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

export function useGetLabels() {
  const labelApi = useLabelApi();
  return useSuspenseQuery({
    queryKey: schoolEntryApiQueryKey(["getSchoolEntryLabels"]),
    queryFn: () => labelApi.getLabels(),
    select: (response) => mapLabels(response.labels),
  });
}
