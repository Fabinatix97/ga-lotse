/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMutation } from "@tanstack/react-query";

import { useSnackbar } from "@eshg/lib-portal";
import { ApiPutOmsConfigRequest } from "@eshg/official-medical-service-api";

import { useConfiguratorOmsApi } from "@/lib/shared/api/clients";

function evaluateErrorMessage(message: string): string {
  const CONCERNS_DOCUMENT = "concerns";
  const LANDING_PAGE_DE_DOCUMENT = "landing page (de)";
  const LANDING_PAGE_EN_DOCUMENT = "landing page (en)";

  try {
    const parsed = JSON.parse(message) as Record<string, string>;
    const documentKey: string = parsed.document!;
    const errorText: string = parsed.message!;

    let document;
    switch (documentKey) {
      case CONCERNS_DOCUMENT:
        document = "Liste der Anliegen";
        break;
      case LANDING_PAGE_DE_DOCUMENT:
        document = "Startseite im Online Portal (deutsch)";
        break;
      case LANDING_PAGE_EN_DOCUMENT:
        document = "Startseite im Online Portal (englisch)";
        break;
      default:
        document = "nicht zugeordnet";
        break;
    }
    return document + " fehlerhaft: " + errorText;
    // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (e) {
    return "allgemeiner Fehler beim Hochladen der Dokumente: " + message;
  }
}

export function useUpdateOms() {
  const snackbar = useSnackbar();
  const api = useConfiguratorOmsApi();

  return useMutation({
    mutationFn: ({
      concerns,
      landingContentDe,
      landingContentEn,
      selectConcernInfoboxDe,
      selectConcernInfoboxEn,
      ...configRequest
    }: {
      concerns?: Blob;
      landingContentDe?: Blob;
      landingContentEn?: Blob;
      selectConcernInfoboxDe?: Blob;
      selectConcernInfoboxEn?: Blob;
    } & ApiPutOmsConfigRequest) =>
      api.putOmsConfig(
        configRequest,
        concerns,
        landingContentDe,
        landingContentEn,
        selectConcernInfoboxDe,
        selectConcernInfoboxEn,
      ),
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
    onError: (e) => {
      const resolved = evaluateErrorMessage(e.message);
      snackbar.error(resolved);
    },
  });
}
