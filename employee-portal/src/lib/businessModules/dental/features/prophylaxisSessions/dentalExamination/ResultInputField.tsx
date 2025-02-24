/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Input, InputProps, VariantProp } from "@mui/joy";

import { SetToothResultAction } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/dentalExaminationStore";
import { useElementFocus } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/hooks/useElementFocus";
import { useKeyboardNavigationHandler } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/hooks/useKeyboardNavigationHandler";
import {
  ElementContext,
  ResultField,
  ToothContext,
  ToothResult,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

interface ResultInputFieldProps extends InputProps {
  field: ResultField;
  result: ToothResult;
  toothContext: ToothContext;
  variant?: VariantProp;
  setResultAction: SetToothResultAction;
}

export function ResultInputField(props: ResultInputFieldProps) {
  const fieldContext: ElementContext = {
    field: props.field,
    toothContext: props.toothContext,
  };
  const { elementRef, focusHandler } = useElementFocus(
    fieldContext,
    (input: HTMLInputElement) => {
      input.focus();
      requestAnimationFrame(() => input.select()); // delay value selection to ensure focus is active
    },
  );
  const keyboardNavigationHandler = useKeyboardNavigationHandler();

  return (
    <Input
      {...props}
      slotProps={{
        input: {
          ref: elementRef,
          "aria-invalid": props.result.isInvalid,
        },
      }}
      value={props.result.value}
      sx={{ width: 60 }}
      color={props.result.isInvalid ? "danger" : "primary"}
      type="text"
      variant={props.variant}
      onChange={(event) => {
        props.setResultAction(
          props.toothContext,
          event.target.value.toUpperCase(),
        );
      }}
      onFocus={focusHandler}
      onKeyDown={keyboardNavigationHandler}
    />
  );
}
