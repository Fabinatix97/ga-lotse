/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import {
  useEvaluationApi,
  useReportApi,
} from "@/lib/businessModules/statistics/api/clients";
import { evaluationApiQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";

export function useGetAnonymizationFailedDetails(id: string, isReport = false) {
  const evaluationApi = useEvaluationApi();
  const reportApi = useReportApi();
  const query = useSuspenseQuery({
    queryKey: evaluationApiQueryKey([
      "getEvaluationOrReportAttributesInformation",
      id,
      isReport,
    ]),
    queryFn: () =>
      isReport
        ? reportApi.getReportAttributesInformation(id)
        : evaluationApi.getEvaluationAttributesInformation(id),
    select: (result) => ({
      dataSourceName: result.attributes[0]!.dataSourceName,
      quasiIdentifier: result.attributes
        .filter((it) => it.privacyCategory === "QUASI_IDENTIFYING")
        .map((it) => it.displayName),
      sensitiveAttributes: result.attributes
        .filter((it) => it.privacyCategory === "SENSITIVE")
        .map((it) => it.displayName),
      insensitiveAttributes: result.attributes
        .filter((it) => it.privacyCategory === "INSENSITIVE")
        .map((it) => it.displayName),
    }),
  });

  return query.data;
}
