/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { OpeningHoursApi } from "@eshg/lib-config-api";
import {
  isEmptyString,
  isNonEmptyString,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";
import { ApiOpeningHours } from "@eshg/school-entry-api";
import { SexWorkOpeningHoursApi } from "@eshg/sti-protection-api";

import { OpeningHoursFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/OpeningHours";
import { OpeningHoursFieldValue } from "@/lib/configurator/components/shared/OpeningHoursField";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useConfiguratorOpeningHoursApi } from "@/lib/shared/api/clients";

export function mapOpeningHoursFieldValue(value: OpeningHoursFieldValue) {
  const rowFields = value.rows
    .filter(
      (row) =>
        isNonEmptyString(row.timeWindow) || isNonEmptyString(row.weekday),
    )
    .flatMap((row) => [row.weekday, row.timeWindow]);
  const hasNoAdditionalInfo = isEmptyString(value.additionalInfo);
  return hasNoAdditionalInfo && rowFields.length > 0
    ? rowFields
    : [...rowFields, value.additionalInfo];
}

function mapToApi(model: OpeningHoursFormModel): ApiOpeningHours {
  return {
    de: mapOpeningHoursFieldValue(model.opening_hours_german),
    en: mapOpeningHoursFieldValue(model.opening_hours_english),
  };
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
