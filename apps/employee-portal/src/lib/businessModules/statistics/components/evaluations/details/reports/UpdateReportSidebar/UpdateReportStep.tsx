/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { InputField } from "@eshg/lib-portal";

import { UpdateReportFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/reports/UpdateReportSidebar/updateReportFormModel";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

export function UpdateReportStep(
  props: SidebarStepContentProps<UpdateReportFormModel>,
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
    </Stack>
  );
}
