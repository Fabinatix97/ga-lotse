/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { BoxProps, getFormControlUtilityClass, styled } from "@mui/joy";

import { Row } from "../Row";

import { FieldSetLegendAndHelper, FieldSetProps } from "./CheckboxGroupField";
import { Legend } from "./Legend";
import { OptionalHelperText } from "./OptionalHelperText";

function UnstyledFieldSetRow(props: Omit<BoxProps, "component">) {
  return <Row {...props} component="fieldset" />;
}
const FieldSetRow = styled(UnstyledFieldSetRow)(() => ({
  margin: 0,
  padding: 0,
  border: "none",
}));
export const FieldSetColumn = styled(FieldSetRow)(() => ({
  flexDirection: "column",
}));

export function FieldSetControl({
  helperText,
  legend,
  children,
  legendLevel,
  error,
  groupHelperTextId,
  ...fieldSetProps
}: FieldSetProps & FieldSetLegendAndHelper) {
  const rootClass = getFormControlUtilityClass("root");
  const errorClass = getFormControlUtilityClass("error");
  const className =
    fieldSetProps.className !== undefined
      ? `${rootClass} ${fieldSetProps.className}`
      : rootClass;

  const classNameWithError = error ? `${errorClass} ${className}` : className;
  return (
    <FieldSetColumn {...fieldSetProps} className={classNameWithError}>
      <Legend level={legendLevel}>{legend}</Legend>
      {children}
      <OptionalHelperText id={groupHelperTextId}>
        {helperText}
      </OptionalHelperText>
    </FieldSetColumn>
  );
}
