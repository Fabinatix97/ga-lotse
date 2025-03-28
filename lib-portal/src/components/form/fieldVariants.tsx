/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { CustomAutocomplete } from "@eshg/lib-portal/components/inputs/CustomAutocomplete";
import {
  AutocompleteProps,
  Input,
  InputProps,
  Select,
  SelectProps,
} from "@mui/joy";
import { ReactNode } from "react";

import { isEmptyString } from "../../helpers/guards";
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

const SOFT_REQUIRED_INPUT_PROPS = {
  variant: "soft",
  color: "primary",
} as const satisfies InputProps;

const SOFT_REQUIRED_MARKER = {
  "data-soft-required": "",
};

const SOFT_REQUIRED_BUTTON_MARKER = {
  button: SOFT_REQUIRED_MARKER,
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

function SoftRequiredSelect<
  TValue extends NonNullable<unknown>,
  TMultiple extends boolean,
>(props: SelectProps<TValue, TMultiple>) {
  const markAsSoftRequired =
    (props.value === null || props.value === undefined) &&
    props.disabled !== true;
  const additionalProps = markAsSoftRequired ? SOFT_REQUIRED_INPUT_PROPS : null;
  const slotProps = markAsSoftRequired
    ? SOFT_REQUIRED_BUTTON_MARKER
    : undefined;
  return (
    <Select<TValue, TMultiple>
      {...props}
      {...additionalProps}
      slotProps={slotProps}
    />
  );
}

function addSoftRequiredInputMarker(slotProps: InputProps["slotProps"]) {
  return {
    ...slotProps,
    input: { ...slotProps?.input, ...SOFT_REQUIRED_MARKER },
  };
}

export function SoftRequiredInput(props: InputProps) {
  const markAsSoftRequired =
    isEmptyString(props.value) && props.disabled !== true;
  const additionalProps = markAsSoftRequired ? SOFT_REQUIRED_INPUT_PROPS : null;
  const slotProps = markAsSoftRequired
    ? addSoftRequiredInputMarker(props.slotProps)
    : props.slotProps;
  return <Input {...props} {...additionalProps} slotProps={slotProps} />;
}

export interface SoftRequiredSelectFieldProps<
  TMultiple extends boolean,
  TOptionLabel extends string | ReactNode = string,
> extends SoftRequiredFieldProps,
    SelectFieldProps<TMultiple, TOptionLabel> {}

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

export interface SoftRequiredBooleanSelectFieldProps
  extends SoftRequiredFieldProps,
    BooleanSelectFieldProps {}

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
  extends SoftRequiredFieldProps,
    NumberFieldProps {}

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

interface SoftRequiredSelectObjectFieldProps<
  TValue extends object | number,
  TMultiple extends boolean,
> extends SoftRequiredFieldProps,
    SelectObjectFieldProps<TValue, TMultiple> {}

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

function SoftRequiredSelectObject<
  TValue extends NonNullable<unknown>,
  TMultiple extends boolean,
>(props: AutocompleteProps<TValue, TMultiple, false, false>) {
  const markAsSoftRequired =
    (props.value === null || props.value === undefined) &&
    props.disabled !== true;
  const additionalProps = markAsSoftRequired ? SOFT_REQUIRED_INPUT_PROPS : null;
  const slotProps = markAsSoftRequired
    ? { input: SOFT_REQUIRED_MARKER }
    : undefined;
  return (
    <CustomAutocomplete<TValue, TMultiple, false, false>
      {...props}
      {...additionalProps}
      slotProps={slotProps}
    />
  );
}
