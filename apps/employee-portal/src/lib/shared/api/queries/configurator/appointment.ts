/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { durationToMinutes } from "@eshg/lib-portal";

import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { configuratorApiQueryKey } from "@/lib/shared/api/queries/configurator/apiQueryKey";

export function useGetAppointmentStandardDurations<TResponse, TFormModel>(
  module: ConfiguratorModuleName,
  apiHook: () => {
    getStandardDurationsConfig: () => Promise<TResponse>;
  },
  responseMapper: (response: TResponse) => TFormModel,
) {
  const api = apiHook();

  const result = useSuspenseQuery({
    queryKey: configuratorApiQueryKey([
      module,
      api,
      "getStandardDurationsConfig",
    ]),
    queryFn: () => api.getStandardDurationsConfig(),
    select: responseMapper,
  });
  return result.data;
}

export function mapOptionalISODuration(duration: string | undefined) {
  return isDefined(duration) ? durationToMinutes(duration) : "";
}
