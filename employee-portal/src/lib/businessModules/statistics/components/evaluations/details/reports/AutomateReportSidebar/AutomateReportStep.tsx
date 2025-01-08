/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  buildEnumOptions,
  createFieldNameMapper,
} from "@eshg/lib-portal/helpers/form";
import { Divider, Stack, Typography } from "@mui/joy";

import {
  INTERVAL_TRANSLATION,
  Interval,
  REPORTING_PERIOD_TRANSLATION,
  ReportingPeriod,
} from "@/lib/businessModules/statistics/api/models/reportSeriesTypes";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

import {
  AutomateReportFormModel,
  getStartDateOptions as getStartMonthOptions,
} from "./automateReportFormModel";

export function AutomateReportStep() {
  const fieldName = createFieldNameMapper<AutomateReportFormModel>();
  return (
    <Stack gap={3}>
      <Stack gap={2}>
        <InputField
          name={fieldName("name")}
          label="Name"
          required="Bitte Name angeben."
        />
        <TextareaField
          name={fieldName("description")}
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
          name={fieldName("interval")}
          label="Intervall"
          options={buildEnumOptions<Interval>(INTERVAL_TRANSLATION)}
        />
        <SelectField
          name={fieldName("startMonth")}
          label="Startdatum der Automatisierung"
          options={getStartMonthOptions()}
        />
      </Stack>
      <Divider />
      <Typography level="h3" component="h2">
        Betrachtungszeitraum
      </Typography>
      <SelectField
        name={fieldName("reportingPeriod")}
        label="Betrachtungszeitraum"
        options={buildEnumOptions<ReportingPeriod>(
          REPORTING_PERIOD_TRANSLATION,
        )}
        hint="Ausgehend vom Startdatum der Automatisierung"
      />
    </Stack>
  );
}
