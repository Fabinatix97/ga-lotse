/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useReportSeriesApi } from "@/lib/businessModules/statistics/api/clients";
import { UpdateReportFormModel } from "@/lib/businessModules/statistics/components/statistics/details/reports/UpdateReportSidebar/updateReportFormModel";

export function useUpdateReport(onSuccess: () => void) {
  const snackbar = useSnackbar();
  const api = useReportSeriesApi();
  const mutation = useHandledMutation({
    mutationFn: (props: { model: UpdateReportFormModel; seriesId: string }) =>
      api.updateReportSeries(props.seriesId, {
        name: props.model.name.trim(),
        description:
          props.model.description.trim().length > 0
            ? props.model.description.trim()
            : undefined,
      }),
    onSuccess: () => {
      snackbar.confirmation("Report bearbeitet");
      onSuccess();
    },
  });

  return async (seriesId: string, model: UpdateReportFormModel) => {
    return mutation
      .mutateAsync({
        seriesId,
        model: model,
      })
      .then(() => void 0)
      .catch();
  };
}
