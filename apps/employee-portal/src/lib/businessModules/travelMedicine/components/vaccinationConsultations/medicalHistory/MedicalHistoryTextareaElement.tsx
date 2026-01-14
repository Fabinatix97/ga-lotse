/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormLabel, styled } from "@mui/joy";

import { TextareaField, useValidateLength } from "@eshg/lib-portal";

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
  const validateLength = useValidateLength();
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
      placeholder="Bitte Text eingeben"
      label={<StyledLabelComponent>{label}</StyledLabelComponent>}
      validate={validateLength(0, 4000)}
      readOnly={readOnly}
    />
  );
}
