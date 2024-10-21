/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddReportSeriesRequest,
  ApiFrequency,
  ApiReportingPeriod,
} from "@eshg/employee-portal-api/statistics";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useReportSeriesApi } from "@/lib/businessModules/statistics/api/clients";
import {
  Interval,
  ReportingPeriod,
} from "@/lib/businessModules/statistics/api/models/reportSeriesTypes";
import { AutomateReportFormModel } from "@/lib/businessModules/statistics/components/statistics/details/reports/AutomateReportSidebar/automateReportFormModel";

function mapToApiStartMonth(startMonth: string) {
  return parseInt(startMonth) + 1;
}

function mapToApiFrequency(interval: Interval): ApiFrequency {
  switch (interval) {
    case Interval.Month:
      return ApiFrequency.Month;
    case Interval.ThreeMonths:
      return ApiFrequency.ThreeMonths;
    case Interval.HalfYear:
      return ApiFrequency.HalfYear;
    case Interval.Year:
      return ApiFrequency.Year;
  }
}

function mapToApiReportingPeriod(
  reportingPeriod: ReportingPeriod,
): ApiReportingPeriod {
  switch (reportingPeriod) {
    case ReportingPeriod.Month:
      return ApiReportingPeriod.Month;
    case ReportingPeriod.ThreeMonths:
      return ApiReportingPeriod.ThreeMonths;
    case ReportingPeriod.HalfYear:
      return ApiReportingPeriod.HalfYear;
    case ReportingPeriod.Year:
      return ApiReportingPeriod.Year;
  }
}

export function mapToApiAddAutoReportSeriesRequest({
  statisticId,
  model,
}: {
  statisticId: string;
  model: AutomateReportFormModel;
}): ApiAddReportSeriesRequest {
  return {
    name: model.name.trim(),
    description:
      model.description.trim().length > 0
        ? model.description.trim()
        : undefined,
    startMonth: mapToApiStartMonth(model.startMonth),
    frequency: mapToApiFrequency(model.interval),
    reportingPeriod: mapToApiReportingPeriod(model.reportingPeriod),
    type: "AddAutoReportSeriesRequest",
    statisticId,
  };
}

export function useAddAutoReportSeries(onSuccess: () => void) {
  const snackbar = useSnackbar();
  const api = useReportSeriesApi();
  const mutation = useHandledMutation({
    mutationFn: ({
      statisticId,
      model,
    }: {
      statisticId: string;
      model: AutomateReportFormModel;
    }) =>
      api.addReportSeries(
        mapToApiAddAutoReportSeriesRequest({ statisticId, model }),
      ),
    onSuccess: () => snackbar.confirmation("Automatisierung gespeichert"),
  });

  return async (statisticId: string, model: AutomateReportFormModel) => {
    return mutation
      .mutateAsync({ statisticId, model }, { onSuccess })
      .then(() => void 0)
      .catch();
  };
}
