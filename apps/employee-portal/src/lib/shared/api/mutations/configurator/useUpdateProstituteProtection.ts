/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMutation } from "@tanstack/react-query";

import { useSnackbar } from "@eshg/lib-portal";
import {
  ApiLanguage,
  ProstituteProtectionConfigApi,
  UpdateConfigRequest,
} from "@eshg/prostitute-protection-api";

import { ProstituteProtectionFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/ProstituteProtection";
import { useConfiguratorProstituteProtectionApi } from "@/lib/shared/api/clients";
import {
  buildFilePayload,
  buildOptionalFilePayload,
} from "@/lib/shared/api/mutations/configurator/buildFilePayload";

export function useUpdateProstituteProtection() {
  const snackbar = useSnackbar();
  const api = useConfiguratorProstituteProtectionApi();

  return useMutation({
    mutationFn: async (params: ProstituteProtectionFormModel) =>
      api.updateConfigRaw(await buildPayload(api, params)),
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });
}

async function buildPayload(
  api: ProstituteProtectionConfigApi,
  params: ProstituteProtectionFormModel,
): Promise<UpdateConfigRequest> {
  return {
    landingContentDe: await buildFilePayload(
      params.landingContentDe,
      () => api.downloadLandingPage(ApiLanguage.German),
      "document.md",
      "text/markdown",
    ),
    landingContentEn: await buildOptionalFilePayload(
      params.landingContentEn,
      () => api.downloadLandingPage(ApiLanguage.English),
      "document.md",
      "text/markdown",
    ),
    configRequest: {
      onlinePortalBookingEnabled: params.onlinePortalBookingEnabled,
    },
  };
}
