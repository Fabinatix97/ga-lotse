/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useField } from "formik";

import { CheckboxField, SelectField } from "@eshg/lib-portal";

import { DENTITION_TYPE_OPTIONS } from "../../../../config/prophylaxisSession";

interface ScreeningFieldProps {
  screeningDisabled?: boolean;
}

export function ScreeningField(props: ScreeningFieldProps) {
  const [isScreening] = useField<boolean>("isScreening");

  return (
    <Stack gap={3}>
      <CheckboxField
        name="isScreening"
        label="Reihenuntersuchung"
        disabled={props.screeningDisabled}
      />
      {isScreening.value && (
        <SelectField
          name="dentitionType"
          label="Gebisstyp"
          options={DENTITION_TYPE_OPTIONS}
          required="Bitte den Gebisstyp auswählen."
        />
      )}
    </Stack>
  );
}
