/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Duration, addMinutes, intervalToDuration } from "date-fns";

import {
  OptionalFieldValue,
  mapRequiredValue,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";

function useOnSuccess() {
  const snackbar = useSnackbar();
  return function () {
    snackbar.confirmation("Die Änderungen wurden gespeichert.");
  };
}

export function useUpdateAppointmentStandardDuration<TPayload, TFormModel>(
  apiHook: () => {
    updateStandardDurations: (payload: TPayload) => Promise<void>;
  },
  mappingFn: (values: TFormModel) => TPayload,
) {
  const api = apiHook();
  const onSuccess = useOnSuccess();
  const mutation = useHandledMutation({
    mutationFn: (params: TFormModel) =>
      api.updateStandardDurations(mappingFn(params)),
    onSuccess: onSuccess,
  });
  return (model: TFormModel) => {
    return mutation.mutateAsync(model);
  };
}

export function mapDurationValue(value: OptionalFieldValue<number>) {
  return minutesToISODuration(mapRequiredValue(value));
}

function minutesToISODuration(minutes: number) {
  const baseline = new Date();
  return formatISODurationWithoutYearsAndMonths(
    intervalToDuration({ start: baseline, end: addMinutes(baseline, minutes) }),
  );
}

function formatISODurationWithoutYearsAndMonths(duration: Duration) {
  const { days = 0, hours = 0, minutes = 0, seconds = 0 } = duration;
  return `P${days}DT${hours}H${minutes}M${seconds}S`;
}
