/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { Typography } from "@mui/joy";

interface AppointmentSheetProps {
  name: string;
  label: string;
  options: SelectOption[];
}

export function AppointmentSheet({
  name,
  label,
  options,
}: Readonly<AppointmentSheetProps>) {
  return (
    <>
      <Typography level="body-md" sx={{ fontWeight: "bold" }}>
        Termin
      </Typography>
      <SelectField name={name} label={label} options={options} />
    </>
  );
}
