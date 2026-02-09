/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { FormikValues } from "formik";

import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { configuratorApiQueryKey } from "@/lib/shared/api/queries/configurator/apiQueryKey";

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
