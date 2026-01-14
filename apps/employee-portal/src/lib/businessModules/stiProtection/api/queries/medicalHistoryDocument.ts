/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import {
  ApiConcern,
  MedicalHistoryDocumentApi,
} from "@eshg/sti-protection-api";

import { useMedicalHistoryDocumentApi } from "@/lib/businessModules/stiProtection/api/clients";

import { stiProtectionApiQueryKey } from "./apiQueryKeys";

export type MedicalHistoryDocumentLanguage = "DE" | "EN";

export function useGetMedicalHistoryDocumentQuery(
  concern: ApiConcern,
  language: MedicalHistoryDocumentLanguage,
) {
  const api = useMedicalHistoryDocumentApi();
  const endpoint = getApiDocumentEndpoint(api, concern, language).bind(api);

  return useSuspenseQuery({
    queryFn: ({ signal }) =>
      endpoint({ signal })
        .then((response) => {
          return response;
        })
        .catch((_error: Error) => {
          return null;
        }),
    queryKey: stiProtectionApiQueryKey([
      "medicalHistoryDocument",
      concern,
      language,
    ]),
  });
}

function getApiDocumentEndpoint(
  api: MedicalHistoryDocumentApi,
  concern: ApiConcern,
  language: MedicalHistoryDocumentLanguage,
): (init?: RequestInit) => Promise<Blob> {
  if (concern === ApiConcern.HivStiConsultation) {
    if (language === "EN") {
      return api.getConsultationENDocument;
    }
    // language === "DE"
    return api.getConsultationDEDocument;
  }
  // concern === ApiConcern.Sexwork
  if (language === "EN") {
    return api.getSexworkENDocument;
  }
  // language === "DE"
  return api.getSexworkDEDocument;
}
