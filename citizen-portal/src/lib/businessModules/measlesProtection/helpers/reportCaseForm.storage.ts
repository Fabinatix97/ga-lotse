/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ReportMeaslesCase } from "@/lib/businessModules/measlesProtection/components/reportCase/types";

const REPORT_CASE_FORM = "report-case-form";

export function getReportCaseForm(): ReportMeaslesCase | null {
  let result = null;

  if (typeof window === "undefined") return result;

  const reportCaseForm = window.sessionStorage.getItem(REPORT_CASE_FORM);
  if (reportCaseForm) {
    result = JSON.parse(reportCaseForm) as ReportMeaslesCase;
  }

  return result;
}

export function setReportCaseForm(reportCaseForm?: ReportMeaslesCase): void {
  if (typeof window === "undefined") return;

  if (reportCaseForm) {
    window.sessionStorage.setItem(
      REPORT_CASE_FORM,
      JSON.stringify(reportCaseForm),
    );
  } else {
    window.sessionStorage.removeItem(REPORT_CASE_FORM);
  }
}
