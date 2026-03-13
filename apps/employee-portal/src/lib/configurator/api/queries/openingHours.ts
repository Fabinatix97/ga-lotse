/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { chunk, dropLast } from "remeda";

import { OpeningHoursApi } from "@eshg/lib-config-api";
import { ApiGetOpeningHoursConfigResponse } from "@eshg/school-entry-api";
import {
  SexWorkOpeningHoursApi,
  StiConsultationOpeningHoursApi,
} from "@eshg/sti-protection-api";

import { OpeningHoursFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/OpeningHours";
import { OpeningHoursFieldValue } from "@/lib/configurator/components/shared/OpeningHoursField";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { mapToApiLanguage, supportedLanguages } from "@/lib/i18n/language";
import { useConfiguratorOpeningHoursApi } from "@/lib/shared/api/clients";

import { configuratorApiQueryKey } from "./apiQueryKey";

export function useGetOpeningHours(
  module: ConfiguratorModuleName,
): OpeningHoursFormModel {
  const configuratorApi = useConfiguratorOpeningHoursApi(module);

  function createQuery(moduleName: ConfiguratorModuleName) {
    return queryOptions({
      queryKey: configuratorApiQueryKey([
        module,
        configuratorApi,
        "getConfigOpeningHours",
      ]),
      queryFn: () => {
        if (moduleName === "STI_PROTECTION") {
          return (
            configuratorApi as StiConsultationOpeningHoursApi
          ).getConfigOpeningHours();
        } else if (moduleName === "SEX_WORK") {
          return (
            configuratorApi as SexWorkOpeningHoursApi
          ).getConfigOpeningHours1();
        }
        return (configuratorApi as OpeningHoursApi).getConfigOpeningHours();
      },
      select: (data: ApiGetOpeningHoursConfigResponse) => {
        return supportedLanguages.reduce(
          (acc, lang) => {
            acc.openingHours[lang] = mapApiToOpeningHoursFormModel(
              data.openingHoursDto?.localizations?.[mapToApiLanguage(lang)] ??
                [],
            );
            return acc;
          },
          { openingHours: {} } as OpeningHoursFormModel,
        );
      },
    });
  }

  const { data } = useSuspenseQuery(createQuery(module));

  return data;
}

export function mapApiToOpeningHoursFormModel(
  data: string[],
): OpeningHoursFieldValue {
  if (data.length === 0) {
    return emptyOpeningHour;
  }
  if (data.length === 1) {
    return {
      rows: [
        {
          weekday: "",
          timeWindow: "",
        },
      ],
      additionalInfo: data[0]!,
    };
  }
  if (data.length % 2 === 0) {
    // No additionalInfo
    return {
      rows: chunk(data, 2).map((row) => ({
        weekday: row[0],
        timeWindow: row[1]!,
      })),
      additionalInfo: "",
    };
  }
  return {
    rows: chunk(dropLast(data, 1), 2).map((row) => ({
      weekday: row[0],
      timeWindow: row[1]!,
    })),
    additionalInfo: data[data.length - 1]!,
  };
}

const emptyOpeningHour = {
  rows: [
    {
      weekday: "",
      timeWindow: "",
    },
  ],
  additionalInfo: "",
};
