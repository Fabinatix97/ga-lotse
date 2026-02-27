/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import { ApiStatisticsInclusion } from "@eshg/lib-procedures-api";

import { ProcedureStatisticsClient } from "../types/procedureStatisticsClient";

export function useUpdateProcedureStatisticsInclusion(
  procedureApi: ProcedureStatisticsClient,
) {
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (props: {
      procedureId: string;
      statisticsInclusion: ApiStatisticsInclusion;
    }) =>
      procedureApi
        .updateStatisticsInclusion({
          procedures: new Set([props.procedureId]),
          statisticsInclusion: props.statisticsInclusion,
        })
        .then((response) => {
          // Set of primitives are not correctly deserialized by openapi generator
          // https://github.com/OpenAPITools/openapi-generator/issues/19520
          // fixed in 7.9.0, but we are currently on 7.3.0
          if (
            !(response.updatedProcedures as unknown as string[]).includes(
              props.procedureId,
            )
          ) {
            throw new Error("Procedure not updated");
          }
        }),
    onError: () => {
      snackbar.error(
        "Statistik Einstellungen konnten nicht gespeichert werden!",
      );
    },
    onSuccess: () => {
      snackbar.confirmation("Statistik Einstellungen erfolgreich gespeichert.");
    },
  });
}
