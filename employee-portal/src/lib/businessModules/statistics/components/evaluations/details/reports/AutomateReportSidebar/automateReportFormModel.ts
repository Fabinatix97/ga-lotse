/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { addMonths, getMonth, startOfMonth, startOfToday } from "date-fns";

import {
  Interval,
  ReportingPeriod,
} from "@/lib/businessModules/statistics/api/models/reportSeriesTypes";

function getStartOfNextMonth() {
  return addMonths(startOfMonth(startOfToday()), 1);
}

export function getFirstPossibleStartMonth() {
  return getMonth(getStartOfNextMonth()).toString();
}

export function getStartDateOptions() {
  const firstDate = getStartOfNextMonth();
  const dateOptions = [];
  for (let i = 0; i < 12; i++) {
    const date = addMonths(firstDate, i);
    dateOptions.push({
      label: formatDate(date, "DE"),
      value: getMonth(date).toString(),
    });
  }
  return dateOptions;
}
export interface AutomateReportFormModel {
  name: string;
  description: string;
  interval: Interval;
  startMonth: string;
  reportingPeriod: ReportingPeriod;
}
