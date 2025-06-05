/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { ProofRequestLetterApi } from "@eshg/measles-protection-api";

import { measlesProtectionApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";

export function getProofRequestLettersQuery(
  proofRequestLetterApi: ProofRequestLetterApi,
  procedureId: string,
) {
  return queryOptions({
    queryFn: ({ signal }) =>
      proofRequestLetterApi.getProofRequestLetters(procedureId, {
        signal,
      }),
    queryKey: measlesProtectionApiQueryKey([
      "procedures",
      procedureId,
      "proofSubmissionLetters",
    ]),
  });
}
