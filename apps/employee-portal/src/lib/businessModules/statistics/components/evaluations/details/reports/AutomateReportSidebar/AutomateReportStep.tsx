/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";

import {
  InputField,
  SelectField,
  TextareaField,
  buildEnumOptions,
} from "@eshg/lib-portal";

import {
  INTERVAL_TRANSLATION,
  Interval,
  REPORTING_PERIOD_TRANSLATION,
  ReportingPeriod,
} from "@/lib/businessModules/statistics/api/models/reportSeriesTypes";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

import {
  AutomateReportFormModel,
  getStartDateOptions as getStartMonthOptions,
} from "./automateReportFormModel";

export function AutomateReportStep(
  props: SidebarStepContentProps<AutomateReportFormModel>,
) {
  return (
    <Stack gap={3}>
      <Stack gap={2}>
        <InputField
          autoFocus
          name={props.fieldName("name")}
          label="Name"
          required="Bitte Name angeben."
        />
        <TextareaField
          name={props.fieldName("description")}
          label="Beschreibung"
          placeholder="Optional"
          minRows={1}
        />
      </Stack>
      <Divider />
      <Typography level="h3" component="h2">
        Intervall der Automatisierung
      </Typography>
      <Stack gap={2}>
        <SelectField
          name={props.fieldName("interval")}
          label="Intervall"
          options={buildEnumOptions<Interval>(INTERVAL_TRANSLATION)}
        />
        <SelectField
          name={props.fieldName("startMonth")}
          label="Startdatum der Automatisierung"
          options={getStartMonthOptions()}
        />
      </Stack>
      <Divider />
      <Typography level="h3" component="h2">
        Betrachtungszeitraum
      </Typography>
      <SelectField
        name={props.fieldName("reportingPeriod")}
        label="Betrachtungszeitraum"
        options={buildEnumOptions<ReportingPeriod>(
          REPORTING_PERIOD_TRANSLATION,
        )}
        hint="Ausgehend vom Startdatum der Automatisierung"
      />
    </Stack>
  );
}
