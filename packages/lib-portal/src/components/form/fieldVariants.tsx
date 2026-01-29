/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Input, InputProps, Select, SelectProps, styled } from "@mui/joy";
import { ReactNode } from "react";

import { BaseField } from "../formFields/BaseField";
import {
  BooleanSelectField,
  BooleanSelectFieldProps,
} from "../formFields/BooleanSelectField";
import { HorizontalField } from "../formFields/HorizontalField";
import { NumberField, NumberFieldProps } from "../formFields/NumberField";
import { SelectField, SelectFieldProps } from "../formFields/SelectField";
import {
  SelectObjectField,
  SelectObjectFieldProps,
} from "../formFields/SelectObjectField";
import {
  CustomAutocomplete,
  CustomAutocompleteProps,
} from "../inputs/CustomAutocomplete";

function withOverridableSoftRequiredProps<
  TProps extends Pick<InputProps, "color">,
>(props: TProps) {
  if (props.color !== undefined) {
    return props;
  }

  return {
    ...props,
    color: "primary",
  };
}

const SOFT_REQUIRED_STYLES = {
  borderWidth: 2,
};

export type FieldOrientation = "horizontal" | "vertical";

export function resolveFieldComponent(
  orientation: FieldOrientation | undefined,
) {
  return orientation === "vertical" ? BaseField : HorizontalField;
}

interface SoftRequiredFieldProps {
  orientation?: FieldOrientation;
  softRequired?: boolean;
}

const StyledSelect = styled(Select)(SOFT_REQUIRED_STYLES) as typeof Select;

function SoftRequiredSelect<
  TValue extends NonNullable<unknown>,
  TMultiple extends boolean,
>(props: SelectProps<TValue, TMultiple>) {
  return (
    <StyledSelect<TValue, TMultiple>
      {...withOverridableSoftRequiredProps(props)}
    />
  );
}

const StyledInput = styled(Input)(SOFT_REQUIRED_STYLES) as typeof Input;

export function SoftRequiredInput(props: InputProps) {
  return <StyledInput {...withOverridableSoftRequiredProps(props)} />;
}

export interface SoftRequiredSelectFieldProps<
  TMultiple extends boolean,
  TOptionLabel extends string | ReactNode = string,
>
  extends SoftRequiredFieldProps, SelectFieldProps<TMultiple, TOptionLabel> {}

export function SoftRequiredSelectField<
  TMultiple extends boolean = false,
  TOptionLabel extends string | ReactNode = string,
>(props: SoftRequiredSelectFieldProps<TMultiple, TOptionLabel>) {
  const { orientation, softRequired, ...fieldProps } = props;
  return (
    <SelectField<TMultiple, TOptionLabel>
      {...fieldProps}
      component={resolveFieldComponent(orientation)}
      select={softRequired ? SoftRequiredSelect : undefined}
    />
  );
}

interface SoftRequiredSelectObjectFieldProps<
  TValue extends object | number,
  TMultiple extends boolean,
>
  extends SoftRequiredFieldProps, SelectObjectFieldProps<TValue, TMultiple> {}

export function SoftRequiredSelectObjectField<
  TValue extends object | number,
  TMultiple extends boolean = false,
>(props: SoftRequiredSelectObjectFieldProps<TValue, TMultiple>) {
  const { orientation, softRequired, ...fieldProps } = props;
  return (
    <SelectObjectField
      {...fieldProps}
      component={resolveFieldComponent(orientation)}
      autocomplete={
        softRequired ? SoftRequiredSelectObject<TValue, TMultiple> : undefined
      }
    />
  );
}

const StyledAutocomplete = styled(CustomAutocomplete)(
  SOFT_REQUIRED_STYLES,
) as typeof CustomAutocomplete;

function SoftRequiredSelectObject<
  TValue extends NonNullable<unknown>,
  TMultiple extends boolean,
>(props: CustomAutocompleteProps<TValue, TMultiple, false, false>) {
  return (
    <StyledAutocomplete<TValue, TMultiple, false, false>
      {...withOverridableSoftRequiredProps(props)}
    />
  );
}

interface SoftRequiredBooleanSelectFieldProps
  extends SoftRequiredFieldProps, BooleanSelectFieldProps {}

export function SoftRequiredBooleanSelectField(
  props: SoftRequiredBooleanSelectFieldProps,
) {
  const { orientation, softRequired, ...fieldProps } = props;
  return (
    <BooleanSelectField
      {...fieldProps}
      component={resolveFieldComponent(orientation)}
      select={softRequired ? SoftRequiredSelect : undefined}
    />
  );
}

interface SoftRequiredNumberFieldProps
  extends SoftRequiredFieldProps, NumberFieldProps {}

export function SoftRequiredNumberField(props: SoftRequiredNumberFieldProps) {
  const { orientation, softRequired, ...fieldProps } = props;
  return (
    <NumberField
      {...fieldProps}
      component={resolveFieldComponent(orientation)}
      input={softRequired ? SoftRequiredInput : undefined}
    />
  );
}
