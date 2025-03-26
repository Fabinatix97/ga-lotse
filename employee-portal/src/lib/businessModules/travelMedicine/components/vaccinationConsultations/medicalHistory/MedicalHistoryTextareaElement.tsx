/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TextareaField } from "@eshg/lib-employee-portal";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { FormLabel, styled } from "@mui/joy";

interface MedicalHistoryTextareaElementProps {
  label: string;
  name: string;
  labelColor?: string;
  readOnly?: boolean;
}

export function MedicalHistoryTextareaElement({
  label,
  name,
  labelColor,
  readOnly = false,
}: Readonly<MedicalHistoryTextareaElementProps>) {
  const StyledLabelComponent = styled(FormLabel)(() => ({
    fontSize: 14,
    color: labelColor,
  }));

  return (
    <TextareaField
      sxTextarea={{
        marginTop: "0.5rem",
        flex: 1,
        display: "flex",
        flexGrow: 1,
        width: "100%",
      }}
      sx={{ flex: 1 }}
      name={name}
      placeholder={"Bitte Text eingeben"}
      label={<StyledLabelComponent>{label}</StyledLabelComponent>}
      validate={validateLength(0, 4000)}
      readOnly={readOnly}
    />
  );
}
