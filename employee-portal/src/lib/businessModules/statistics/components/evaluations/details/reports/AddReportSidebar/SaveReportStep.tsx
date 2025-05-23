/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";

import { InputField } from "@eshg/lib-portal";

import { AddReportFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/reports/AddReportSidebar/addReportFormModel";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { TimeSpanField } from "@/lib/shared/components/formFields/TimeSpanField";

export function SaveReportStep(
  props: SidebarStepContentProps<AddReportFormModel>,
) {
  return (
    <Stack gap={3}>
      <Stack gap={2}>
        <InputField
          name={props.fieldName("name")}
          label="Name"
          required="Bitte Name angeben."
        />
        <InputField
          name={props.fieldName("description")}
          label="Beschreibung"
          placeholder="Optional"
        />
      </Stack>
      <Divider />
      <Typography level="h3" component="h2">
        Betrachtungszeitraum
      </Typography>
      <TimeSpanField name={props.fieldName("timeSpan")} />
    </Stack>
  );
}
