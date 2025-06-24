/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { configuratorApiQueryKey } from "@/lib/shared/api/queries/configurator/apiQueryKey";
import { durationToMinutes } from "@/lib/shared/helpers/dateTime";

export function useGetAppointmentStandardDurations<TResponse, TFormModel>(
  module: ConfiguratorModuleName,
  apiHook: () => {
    getStandardDurations: () => Promise<TResponse>;
  },
  responseMapper: (response: TResponse) => TFormModel,
) {
  const api = apiHook();

  const result = useSuspenseQuery({
    queryKey: configuratorApiQueryKey([module, api, "getStandardDurations"]),
    queryFn: () => api.getStandardDurations(),
    select: responseMapper,
  });
  return result.data;
}

export function mapOptionalISODuration(duration: string | undefined) {
  return isDefined(duration) ? durationToMinutes(duration) : "";
}
