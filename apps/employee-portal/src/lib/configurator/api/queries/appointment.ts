/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { durationToMinutes } from "@eshg/lib-portal";

import { configuratorApiQueryKey } from "@/lib/configurator/api/queries/apiQueryKey";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";

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
