/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMutation } from "@tanstack/react-query";

import {
  ApiLanguage,
  InfectionBriefingConfigApi,
  UpdateConfigRequest,
} from "@eshg/infection-briefing-api";
import { useSnackbar } from "@eshg/lib-portal";

import { InfectionBriefingFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/InfectionBriefing";
import { useConfiguratorInfectionBriefingApi } from "@/lib/shared/api/clients";
import {
  buildFilePayload,
  buildOptionalFilePayload,
} from "@/lib/shared/api/mutations/configurator/buildFilePayload";

export function useUpdateInfectionBriefing() {
  const snackbar = useSnackbar();
  const api = useConfiguratorInfectionBriefingApi();

  return useMutation({
    mutationFn: async (params: InfectionBriefingFormModel) =>
      api.updateConfigRaw(await buildPayload(api, params)),
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });
}

async function buildPayload(
  api: InfectionBriefingConfigApi,
  params: InfectionBriefingFormModel,
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
  };
}
