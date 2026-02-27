/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiBulkUpdateProceduresStatisticsInclusionRequest,
  ApiBulkUpdateProceduresStatisticsInclusionResponse,
} from "@eshg/lib-procedures-api";

export interface ProcedureStatisticsClient {
  updateStatisticsInclusion(
    apiBulkUpdateProceduresStatisticsInclusionRequest: ApiBulkUpdateProceduresStatisticsInclusionRequest,
  ): Promise<ApiBulkUpdateProceduresStatisticsInclusionResponse>;
}
