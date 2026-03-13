/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { FormikValues } from "formik";

import { configuratorApiQueryKey } from "@/lib/configurator/api/queries/apiQueryKey";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";

export function useGetAppointmentDefaultAvailability<
  TResponse,
  TFormModel extends FormikValues,
>(
  module: ConfiguratorModuleName,
  apiHook: () => {
    getConfiguredAvailability: () => Promise<TResponse>;
  },
  responseMapper: (response: TResponse) => TFormModel,
) {
  const api = apiHook();

  const result = useSuspenseQuery({
    queryKey: configuratorApiQueryKey([
      module,
      api,
      "getConfiguredAvailability",
    ]),
    queryFn: () => api.getConfiguredAvailability(),
    select: responseMapper,
  });
  return result.data;
}
