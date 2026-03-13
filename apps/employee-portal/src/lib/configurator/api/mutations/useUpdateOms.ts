/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import { useSnackbar } from "@eshg/lib-portal";

import {
  buildFilePayload,
  buildMultiLanguagePayload,
} from "@/lib/configurator/api/mutations/buildFilePayload";
import { OfficialMedicalServiceFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/OfficialMedicalService";
import { SupportedLanguage, mapToApiLanguage } from "@/lib/i18n/language";
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

  const mutation = useMutation({
    mutationFn: async (request: OfficialMedicalServiceFormModel) =>
      api.putOmsConfig(
        {
          citizenPortalAnamnesisEnabled:
            request.citizenPortalAnamnesisEnabled === "true",
          keycloakUserCleanupJobOverdueDuration:
            +request.keycloakUserCleanupJobOverdueDuration,
          medicalOpinionCutOffDateLeadTime:
            +request.medicalOpinionCutOffDateLeadTime,
        },
        await buildFilePayload(
          request.concerns,
          () => api.downloadConcerns(),
          "concerns.yaml",
          "application/yaml",
        ),
        await buildMultiLanguagePayload(
          request.landingContent,
          (lang: SupportedLanguage) =>
            api.downloadLandingPage(mapToApiLanguage(lang)),
          "md",
        ),
        await buildMultiLanguagePayload(
          request.selectConcernInfobox,
          (lang: SupportedLanguage) =>
            api.downloadSelectConcernInfobox(mapToApiLanguage(lang)),
          "md",
        ),
      ),
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
    onError: (e) => {
      const resolved = evaluateErrorMessage(e.message);
      snackbar.error(resolved);
    },
  });

  return (model: OfficialMedicalServiceFormModel) => {
    return mutation.mutateAsync(model);
  };
}
