/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useProofRequestLetterApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { measlesProtectionApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";

export function useProofRequestLettersQuery(procedureId: string) {
  const proofRequestLetterApi = useProofRequestLetterApi();
  return useSuspenseQuery({
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
