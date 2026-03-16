/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal";
import { ApiGetStartUserFlowTrackingRequest } from "@eshg/school-entry-api";

import { useSchoolEntryCitizenApi } from "@/lib/businessModules/schoolEntry/api/clients";

export function useStartUserFlowTracking() {
  const schoolEntryCitizenApi = useSchoolEntryCitizenApi();
  return useHandledMutation({
    mutationFn: (request: ApiGetStartUserFlowTrackingRequest) =>
      schoolEntryCitizenApi.getStartUserFlowTrackingResponse(request),
  });
}
