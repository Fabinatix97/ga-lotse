/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";

import { UpdateReportFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/reports/UpdateReportSidebar/updateReportFormModel";

export function UpdateReportStep() {
  const fieldName = createFieldNameMapper<UpdateReportFormModel>();
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
    </Stack>
  );
}
