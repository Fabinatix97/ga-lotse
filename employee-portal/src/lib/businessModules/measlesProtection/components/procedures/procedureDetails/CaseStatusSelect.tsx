/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormControl, Select } from "@mui/joy";

import {
  SelectOptions,
  optionsFromRecord,
} from "@eshg/lib-portal/components/formFields/SelectOptions";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  ApiCaseStatus,
  ApiGetProcedure200Response,
} from "@eshg/measles-protection-api";

import { useUpdateCaseStatusMutation } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { caseStatusNames } from "@/lib/businessModules/measlesProtection/components/procedures/constants";

export function CaseStatusSelect({
  procedure,
}: {
  readonly procedure: ApiGetProcedure200Response;
}) {
  const updateCaseStatus = useUpdateCaseStatusMutation({
    onSuccess() {
      snackbar.confirmation("Bearbeitungszustand aktualisiert");
    },
  });
  const snackbar = useSnackbar();
  const procedureClosed = !procedure.isOpen;

  async function onChange(_event: unknown, value: string | null) {
    const newValue = value as ApiCaseStatus;
    if (newValue !== null) {
      await updateCaseStatus.mutateAsync({
        procedureId: procedure.id,
        data: newValue,
      });
    }
  }

  return (
    <FormControl disabled={procedureClosed}>
      <Select
        aria-label="Bearbeitungszustand"
        defaultValue={procedure.caseStatus}
        variant="soft"
        color="warning"
        sx={{
          width: "200px",
        }}
        slotProps={{
          listbox: {
            placement: "bottom-start",
          },
        }}
        onChange={onChange}
      >
        <SelectOptions options={optionsFromRecord(caseStatusNames)} />
      </Select>
    </FormControl>
  );
}
