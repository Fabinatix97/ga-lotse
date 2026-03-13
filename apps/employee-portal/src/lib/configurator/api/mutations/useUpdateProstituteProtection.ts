/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import { useSnackbar } from "@eshg/lib-portal";

import { buildMultiLanguagePayload } from "@/lib/configurator/api/mutations/buildFilePayload";
import { ProstituteProtectionFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/ProstituteProtection";
import { SupportedLanguage, mapToApiLanguage } from "@/lib/i18n/language";
import { useConfiguratorProstituteProtectionApi } from "@/lib/shared/api/clients";

export function useUpdateProstituteProtection() {
  const snackbar = useSnackbar();
  const api = useConfiguratorProstituteProtectionApi();

  return useMutation({
    mutationFn: async (params: ProstituteProtectionFormModel) =>
      api.updateConfigRaw({
        files: await buildMultiLanguagePayload(
          params.landingContent,
          (lang: SupportedLanguage) =>
            api.downloadLandingPage(mapToApiLanguage(lang)),
          "md",
        ),
        configRequest: {
          onlinePortalBookingEnabled: params.onlinePortalBookingEnabled,
        },
      }),
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });
}
