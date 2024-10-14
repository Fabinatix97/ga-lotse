/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Select, SelectProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { isDefined } from "remeda";

import { FieldProps } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";

import { BaseField, FieldComponentProps, useBaseField } from "./BaseField";
import { SelectOption, SelectOptions } from "./SelectOptions";
import { StyledInputProps } from "./types";

function toJoyUiSelectValue<TMultiple extends boolean>(
  value: string | string[],
) {
  return (
    typeof value === "string" && value === "" ? null : value
  ) as JoyUiSelectValue<TMultiple>;
}

type JoyUiSelectValue<TMultiple extends boolean> = Exclude<
  SelectProps<string, TMultiple>["value"],
  undefined
>;
export type SelectFieldValue<TMultiple extends boolean> = NonNullable<
  JoyUiSelectValue<TMultiple>
>;

export interface SelectFieldProps<
  TMultiple extends boolean,
  TOptionLabel extends string | ReactNode = string,
> extends FieldProps<SelectFieldValue<TMultiple>>,
    FieldComponentProps,
    StyledInputProps {
  options: SelectOption<string, TOptionLabel>[];
  multiple?: TMultiple;
  placeholder?: string;
  disabled?: boolean;
  select?: (props: SelectProps<string, TMultiple>) => ReactNode;
  onChange?: (value: SelectFieldValue<TMultiple>) => void;
  renderValue?: RenderValueFunction<TMultiple>;
  className?: string | undefined;
  sx?: SxProps;
}

type RenderValueFunction<TMultiple extends boolean> = SelectProps<
  string,
  TMultiple
>["renderValue"];
export type SelectFieldOption<TMultiple extends boolean> = Parameters<
  NonNullable<RenderValueFunction<TMultiple>>
>[0];

export function SelectField<
  TMultiple extends boolean = false,
  TOptionLabel extends string | ReactNode = string,
>(props: SelectFieldProps<TMultiple, TOptionLabel>) {
  const FieldComponent = props.component ?? BaseField;
  const SelectComponent = props.select ?? Select;
  const field = useBaseField<SelectFieldValue<TMultiple>>(props);
  const disabled = useIsFormDisabled();

  const { enqueue } = usePromiseSequencer();

  return (
    <FieldComponent
      label={props.label}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
      className={props.className}
      sx={props.sx}
      disabled={props.disabled}
    >
      <SelectComponent
        name={props.name}
        value={toJoyUiSelectValue<TMultiple>(field.input.value)}
        onChange={(_, newValue) => {
          const emptyValue = props.multiple ? [] : "";
          const newFieldValue = (newValue ??
            emptyValue) as SelectFieldValue<TMultiple>;
          enqueue(async () => {
            await field.helpers.setValue(newFieldValue);
            if (isDefined(props.onChange)) {
              props.onChange(newFieldValue);
            }
          });
        }}
        // Trigger the validation when the dropdown is closed, acting similar to a blur
        onClose={() => enqueue(() => field.helpers.setTouched(true, true))}
        onBlur={(event) => {
          // The relatedTarget is a <li> when the dropdown is opened,
          // we don't want to trigger the blur in that case.
          if (event.relatedTarget instanceof HTMLInputElement) {
            field.input.onBlur(event);
          }
        }}
        multiple={props.multiple}
        placeholder={props.placeholder}
        disabled={disabled || props.disabled}
        renderValue={props.renderValue}
        color={props.primary ? "primary" : undefined}
      >
        <SelectOptions options={props.options} />
      </SelectComponent>
    </FieldComponent>
  );
}

// Necessary because onClose and onChange race and override each other!
function usePromiseSequencer() {
  const status = useRef("idle");
  const [queue, setQueue] = useState<(() => Promise<unknown>)[]>([]);

  const enqueue = useCallback(
    (task: () => Promise<unknown>) => {
      setQueue((queue) => [...queue, task]);
    },
    [setQueue],
  );

  function unshiftQueue() {
    status.current = "idle";
    setQueue((current) => current.slice(1));
  }

  useEffect(() => {
    if (queue.length > 0 && status.current === "idle") {
      status.current = "running";
      const task = queue.at(0);
      if (isDefined(task)) {
        void task().finally(unshiftQueue);
      } else {
        unshiftQueue();
      }
    }
  }, [queue]);

  return {
    enqueue,
  };
}
