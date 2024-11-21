/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { parseISO } from "date-fns";
import { useRouter } from "next/navigation";

import { useStatisticApi } from "@/lib/businessModules/statistics/api/clients";
import { mapTimeRangeEndFrontendToApi } from "@/lib/businessModules/statistics/api/mapper/mapTimeRangeEnd";
import { TimeSpan } from "@/lib/shared/components/formFields/TimeSpanField";

export function useUpdateDataBasis({
  redirectRoute,
}: {
  redirectRoute: string;
}) {
  const snackbar = useSnackbar();
  const statisticApi = useStatisticApi();
  const router = useRouter();

  const mutation = useHandledMutation({
    mutationFn: ({
      statisticId,
      timeSpan,
    }: {
      statisticId: string;
      timeSpan: TimeSpan;
    }) =>
      statisticApi.updateEvaluation(statisticId, {
        type: "UpdateEvaluationTimeRangeRequest",
        timeRange: {
          start: parseISO(timeSpan.start),
          end: mapTimeRangeEndFrontendToApi(parseISO(timeSpan.end)),
        },
      }),
    onSuccess: () => {
      snackbar.confirmation("Datenbasis wird aktualisiert");
      router.push(redirectRoute);
    },
  });

  return async (statisticId: string, timeSpan: TimeSpan) => {
    return mutation.mutateAsync({
      statisticId: statisticId,
      timeSpan: timeSpan,
    });
  };
}
