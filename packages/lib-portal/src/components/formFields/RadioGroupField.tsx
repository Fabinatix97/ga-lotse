/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormControl, FormLabel, RadioGroup } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FieldHelperProps } from "formik";
import {
  ChangeEvent,
  PropsWithChildren,
  ReactNode,
  memo,
  useEffect,
  useState,
} from "react";
import { isDefined } from "remeda";

import { useFocus } from "../../hooks/useFocus";
import { ValidationRules } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";

import { renderHelperText, useBaseField } from "./BaseField";

export interface RadioGroupFieldProps
  extends ValidationRules<string>, PropsWithChildren {
  name: string;
  label?: string | ReactNode;
  sx?: SxProps;
  orientation?: "horizontal" | "vertical";
  onChange?: (newValue: string) => void;
  "data-testid"?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
  autoFocus?: boolean;
}

export function RadioGroupField(props: RadioGroupFieldProps) {
  const { input, error, required, helpers } = useBaseField<string>(props);

  return (
    <MemoizedRadioGroupField
      fieldInputName={input.name}
      fieldInputValue={input.value}
      fieldRequired={required}
      fieldError={error}
      fieldHelpersSetValue={helpers.setValue}
      {...props}
    />
  );
}

interface InnerRadioGroupFieldProps extends RadioGroupFieldProps {
  fieldInputName: string;
  fieldInputValue: string;
  fieldError: boolean;
  fieldRequired: boolean;
  fieldHelpersSetValue: FieldHelperProps<string>["setValue"];
}

const MemoizedRadioGroupField = memo(InnerRadioGroupField);

function InnerRadioGroupField({
  fieldHelpersSetValue,
  fieldError,
  fieldInputValue,
  fieldInputName,
  fieldRequired,
  sx,
  orientation,
  label,
  children,
  ...props
}: InnerRadioGroupFieldProps) {
  const isFormDisabled = useIsFormDisabled();

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    await fieldHelpersSetValue(event.target.value);
    if (isDefined(props.onChange)) {
      props.onChange(event.target.value);
    }
  }

  // This weird way of writing it, prevents breaking the JoyUI internal way of setting it
  const rootSlotProps = props["aria-labelledby"]
    ? {
        "aria-labelledby": props["aria-labelledby"],
      }
    : {};

  const [initFocus, setInitFocus] = useState(props.autoFocus);
  const { ref, focus } = useFocus();
  useEffect(() => {
    if (initFocus) {
      setInitFocus(false);
      focus();
    }
  }, [initFocus, focus]);

  return (
    <FormControl
      error={fieldError}
      required={fieldRequired}
      sx={sx}
      disabled={isFormDisabled}
      data-testid={props["data-testid"]}
    >
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup
        ref={(el) => {
          ref.current = el;
        }}
        name={fieldInputName}
        value={fieldInputValue}
        orientation={orientation}
        slotProps={{
          root: rootSlotProps,
        }}
        tabIndex={-1}
        aria-label={props["aria-label"]}
        onChange={handleChange}
        onFocus={(el) => {
          // Transfer the focus to its first Radio input
          el.target.querySelector("input")?.focus();
        }}
      >
        {children}
      </RadioGroup>
      {fieldError && renderHelperText(props.required)}
    </FormControl>
  );
}
