/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  List,
  ListItem,
  Option,
  Select,
  SelectProps,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FieldHelperProps, FormikHandlers } from "formik";
import {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { isDefined } from "remeda";

import { useTranslation } from "../../i18n/useTranslation";
import { FieldProps } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";

import { BaseField, FieldComponentProps, useBaseField } from "./BaseField";
import { SelectOption, SelectOptions } from "./SelectOptions";
import { FieldVariantProps } from "./types";

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

export interface GroupedOption {
  id: string;
  name: ReactNode;
}

export interface SelectFieldProps<
  TMultiple extends boolean,
  TOptionLabel extends string | ReactNode = string,
>
  extends
    FieldProps<SelectFieldValue<TMultiple>>,
    FieldComponentProps,
    FieldVariantProps {
  options?: SelectOption<string, TOptionLabel>[];
  groupedOptions?: Record<string, GroupedOption[]>;
  multiple?: TMultiple;
  placeholder?: string;
  disabled?: boolean;
  select?: (props: SelectProps<string, TMultiple>) => ReactNode;
  onChange?: (value: SelectFieldValue<TMultiple>) => void;
  renderValue?: RenderValueFunction<TMultiple>;
  className?: string | undefined;
  sx?: SxProps;
  ref?: (el: HTMLElement | null) => void;
  autoFocus?: boolean;
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
  const field = useBaseField<SelectFieldValue<TMultiple>>(props);

  return (
    <MemoizedSelectField
      {...props}
      fieldHelperText={field.helperText}
      fieldRequired={field.required}
      fieldError={field.error}
      fieldInputValue={field.input.value}
      fieldHelpersSetValue={field.helpers.setValue}
      fieldHelpersSetTouched={field.helpers.setTouched}
      fieldInputOnBlur={field.input.onBlur}
    />
  );
}

interface InnerSelectFieldProps<
  TMultiple extends boolean,
  TOptionLabel extends string | ReactNode = string,
> extends SelectFieldProps<TMultiple, TOptionLabel> {
  fieldHelperText?: string;
  fieldRequired: boolean;
  fieldError: boolean;
  fieldInputValue: SelectFieldValue<TMultiple>;
  fieldHelpersSetValue: FieldHelperProps<
    SelectFieldValue<TMultiple>
  >["setValue"];
  fieldHelpersSetTouched: FieldHelperProps<
    SelectFieldValue<TMultiple>
  >["setTouched"];
  fieldInputOnBlur: FormikHandlers["handleBlur"];
}

const MemoizedSelectField = memo(InnerSelectField) as typeof InnerSelectField;

function InnerSelectField<
  TMultiple extends boolean = false,
  TOptionLabel extends string | ReactNode = string,
>(props: Readonly<InnerSelectFieldProps<TMultiple, TOptionLabel>>) {
  const { t } = useTranslation();
  const FieldComponent = props.component ?? BaseField;
  const SelectComponent = props.select ?? Select;
  const disabled = useIsFormDisabled() || props.disabled;

  const options = props.options ?? [];

  const { enqueue } = usePromiseSequencer();

  return (
    <FieldComponent
      label={props.label}
      helperText={props.fieldHelperText}
      required={props.fieldRequired}
      error={props.fieldError}
      className={props.className}
      sx={props.sx}
      disabled={disabled}
    >
      <SelectComponent
        autoFocus={props.autoFocus}
        slotProps={{
          button: {
            ref: props.ref,
          },
        }}
        name={props.name}
        value={toJoyUiSelectValue<TMultiple>(props.fieldInputValue)}
        // Trigger the validation when the dropdown is closed, acting similar to a blur
        multiple={props.multiple}
        placeholder={props.placeholder}
        disabled={disabled}
        required={props.fieldRequired}
        renderValue={props.renderValue}
        color={props.primary ? "primary" : undefined}
        aria-description={
          props.multiple ? t("form.multipleSelectionPossible") : undefined
        }
        onChange={(_, newValue) => {
          const emptyValue = props.multiple ? [] : "";
          const newFieldValue = (newValue ??
            emptyValue) as SelectFieldValue<TMultiple>;
          enqueue(async () => {
            await props.fieldHelpersSetValue(newFieldValue);
            if (isDefined(props.onChange)) {
              props.onChange(newFieldValue);
            }
          });
        }}
        onClose={() => enqueue(() => props.fieldHelpersSetTouched(true, true))}
        onBlur={(event) => {
          // The relatedTarget is a <li> when the dropdown is opened,
          // we don't want to trigger the blur in that case.
          if (event.relatedTarget instanceof HTMLInputElement) {
            props.fieldInputOnBlur(event);
          }
        }}
      >
        {props.groupedOptions ? (
          Object.entries(props.groupedOptions).map(([groupName, items]) => (
            <List key={groupName} aria-labelledby={groupName}>
              <ListItem
                id={groupName}
                sticky
                sx={{
                  backgroundColor: (theme) => theme.palette.background.level1,
                }}
              >
                <Typography level="body-md">{groupName}</Typography>
              </ListItem>
              {items.map((item) => (
                <Option key={item.id} value={item.id} sx={{ paddingLeft: 4 }}>
                  {item.name}
                </Option>
              ))}
            </List>
          ))
        ) : (
          <SelectOptions options={options} />
        )}
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
