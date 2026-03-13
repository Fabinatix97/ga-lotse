/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OpeningHoursApi } from "@eshg/lib-config-api";
import {
  isNonEmptyString,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";
import { ApiOpeningHours } from "@eshg/school-entry-api";
import { SexWorkOpeningHoursApi } from "@eshg/sti-protection-api";

import { OpeningHoursFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/OpeningHours";
import { OpeningHoursFieldValue } from "@/lib/configurator/components/shared/OpeningHoursField";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { mapToApiLanguage, supportedLanguages } from "@/lib/i18n/language";
import { useConfiguratorOpeningHoursApi } from "@/lib/shared/api/clients";

export function mapOpeningHoursFieldValue(value: OpeningHoursFieldValue) {
  const rowFields = value.rows
    .filter(
      (row) =>
        isNonEmptyString(row.timeWindow) || isNonEmptyString(row.weekday),
    )
    .flatMap((row) => [row.weekday, row.timeWindow]);
  if (isNonEmptyString(value.additionalInfo)) {
    rowFields.push(value.additionalInfo);
  }
  return rowFields;
}

function mapToApi(model: OpeningHoursFormModel): ApiOpeningHours {
  return supportedLanguages.reduce(
    (acc, key) => {
      acc.localizations[mapToApiLanguage(key)] = mapOpeningHoursFieldValue(
        model.openingHours[key],
      );
      return acc;
    },
    { localizations: {} } as ApiOpeningHours,
  );
}

export function useUpdateOpeningHours(module: ConfiguratorModuleName) {
  const snackbar = useSnackbar();
  const configuratorApi = useConfiguratorOpeningHoursApi(module);

  const mutation = useHandledMutation({
    mutationFn: (params: OpeningHoursFormModel) => {
      if (module === "SEX_WORK") {
        return (
          configuratorApi as SexWorkOpeningHoursApi
        ).updateConfigOpeningHours1(mapToApi(params));
      }
      return (configuratorApi as OpeningHoursApi).updateConfigOpeningHours(
        mapToApi(params),
      );
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return (model: OpeningHoursFormModel) => {
    return mutation.mutateAsync(model);
  };
}
