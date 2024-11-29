/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { parseISO } from "date-fns";
import { useRouter } from "next/navigation";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";
import { mapTimeRangeEndFrontendToApi } from "@/lib/businessModules/statistics/api/mapper/mapTimeRangeEnd";
import { TimeSpan } from "@/lib/shared/components/formFields/TimeSpanField";

export function useUpdateDataBasis({
  redirectRoute,
}: {
  redirectRoute: string;
}) {
  const snackbar = useSnackbar();
  const evaluationApi = useEvaluationApi();
  const router = useRouter();

  const mutation = useHandledMutation({
    mutationFn: ({
      evaluationId,
      timeSpan,
    }: {
      evaluationId: string;
      timeSpan: TimeSpan;
    }) =>
      evaluationApi.updateEvaluation(evaluationId, {
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

  return async (evaluationId: string, timeSpan: TimeSpan) => {
    return mutation.mutateAsync({
      evaluationId: evaluationId,
      timeSpan: timeSpan,
    });
  };
}
