/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { endOfDay, parseISO } from "date-fns";

import { useReportSeriesApi } from "@/lib/businessModules/statistics/api/clients";
import { AddReportFormModel } from "@/lib/businessModules/statistics/components/statistics/details/reports/AddReportSidebar/addReportFormModel";

export function useAddReport(onSuccess: () => void) {
  const snackbar = useSnackbar();
  const api = useReportSeriesApi();
  const mutation = useHandledMutation({
    mutationFn: ({
      statisticId,
      model,
    }: {
      statisticId: string;
      model: AddReportFormModel;
    }) =>
      api.addReportSeries({
        name: model.name.trim(),
        description:
          model.description.trim().length > 0
            ? model.description.trim()
            : undefined,
        timeRangeStart: parseISO(model.timeSpan.start),
        timeRangeEnd: endOfDay(parseISO(model.timeSpan.end)),
        type: "AddManualReportSeriesRequest",
        statisticId: statisticId,
      }),
    onSuccess: () => {
      snackbar.confirmation("Report erstellt");
      onSuccess();
    },
  });

  return async (statisticId: string, model: AddReportFormModel) => {
    await mutation.mutateAsync({
      statisticId: statisticId,
      model: model,
    });
  };
}
