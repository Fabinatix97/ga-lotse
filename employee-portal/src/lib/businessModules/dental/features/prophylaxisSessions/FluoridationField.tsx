/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { Stack } from "@mui/joy";
import { useField } from "formik";

import { FLUORIDATION_VARNISH_OPTIONS } from "@/lib/businessModules/dental/features/prophylaxisSessions/options";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";

interface FluoridationFieldProps {
  disabled?: boolean;
}

export function FluoridationField(props: FluoridationFieldProps) {
  const [isFluoridation] = useField<boolean>("isFluoridation");

  return (
    <Stack gap={3}>
      <CheckboxField
        name="isFluoridation"
        label="Fluoridierung"
        disabled={props.disabled}
      />
      {isFluoridation.value && (
        <SelectField
          name="fluoridationVarnish"
          label="Lack"
          options={FLUORIDATION_VARNISH_OPTIONS}
          required="Bitte den Lack auswählen."
          disabled={props.disabled}
        />
      )}
    </Stack>
  );
}
