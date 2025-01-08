/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ProofRequestLetterApi } from "@eshg/employee-portal-api/measlesProtection";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useProofRequestLetterApi } from "@/lib/businessModules/measlesProtection/api/clients";
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

export function useProofRequestLettersQuery(procedureId: string) {
  const proofRequestLetterApi = useProofRequestLetterApi();

  return useSuspenseQuery(
    getProofRequestLettersQuery(proofRequestLetterApi, procedureId),
  );
}
