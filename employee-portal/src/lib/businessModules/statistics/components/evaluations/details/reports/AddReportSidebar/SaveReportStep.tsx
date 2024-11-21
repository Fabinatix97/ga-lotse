/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Divider, Stack, Typography } from "@mui/joy";

import { AddReportFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/reports/AddReportSidebar/addReportFormModel";
import { TimeSpanField } from "@/lib/shared/components/formFields/TimeSpanField";

export function SaveReportStep() {
  const fieldName = createFieldNameMapper<AddReportFormModel>();
  return (
    <Stack gap={3}>
      <Stack gap={2}>
        <InputField
          name={fieldName("name")}
          label="Name"
          required="Bitte Name angeben."
        />
        <InputField
          name={fieldName("description")}
          label="Beschreibung"
          placeholder="Optional"
        />
      </Stack>
      <Divider />
      <Typography level="h3" component="h2">
        Betrachtungszeitraum
      </Typography>
      <TimeSpanField name="timeSpan" />
    </Stack>
  );
}
