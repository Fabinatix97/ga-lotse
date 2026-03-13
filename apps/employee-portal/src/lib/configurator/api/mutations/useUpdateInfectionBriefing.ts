/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import { useSnackbar } from "@eshg/lib-portal";

import { buildMultiLanguagePayload } from "@/lib/configurator/api/mutations/buildFilePayload";
import { InfectionBriefingFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/InfectionBriefing";
import { SupportedLanguage, mapToApiLanguage } from "@/lib/i18n/language";
import { useConfiguratorInfectionBriefingApi } from "@/lib/shared/api/clients";

export function useUpdateInfectionBriefing() {
  const snackbar = useSnackbar();
  const api = useConfiguratorInfectionBriefingApi();

  return useMutation({
    mutationFn: async (params: InfectionBriefingFormModel) =>
      api.updateConfigRaw({
        files: await buildMultiLanguagePayload(
          params.landingContent,
          (lang: SupportedLanguage) =>
            api.downloadLandingPage(mapToApiLanguage(lang)),
          "md",
        ),
      }),
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });
}
