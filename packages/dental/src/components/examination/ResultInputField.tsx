/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Input, InputProps, VariantProp } from "@mui/joy";

import { SetToothResultAction } from "@/stores/examination/examinationStore";
import { useElementFocus } from "@/stores/examination/hooks/useElementFocus";
import { useKeyboardNavigationHandler } from "@/stores/examination/hooks/useKeyboardNavigationHandler";
import {
  ElementContext,
  ToothContext,
  ToothFieldElement,
  ToothResult,
} from "@/stores/examination/types";

interface ResultInputFieldProps extends InputProps {
  field: ToothFieldElement;
  result: ToothResult;
  toothContext: ToothContext;
  variant?: VariantProp;
  setResultAction: SetToothResultAction;
}

export function ResultInputField(props: ResultInputFieldProps) {
  const { result, toothContext, setResultAction, ...inputProps } = props;
  const fieldContext: ElementContext = {
    toothContext,
    element: props.field,
  };
  const { elementRef, focusHandler, blurHandler } = useElementFocus(
    fieldContext,
    (input: HTMLInputElement) => {
      input.focus();
      requestAnimationFrame(() => input.select()); // delay value selection to ensure focus is active
    },
  );

  const keyboardNavigationHandler = useKeyboardNavigationHandler();

  return (
    <Input
      {...inputProps}
      slotProps={{
        input: {
          ref: elementRef,
          "aria-invalid": result.isInvalid,
        },
      }}
      value={result.value}
      sx={{ width: 60 }}
      color={result.isInvalid ? "danger" : "primary"}
      type="text"
      variant={props.variant}
      onChange={(event) => {
        setResultAction(toothContext, event.target.value.toUpperCase());
      }}
      onFocus={focusHandler}
      onBlur={blurHandler}
      onKeyDown={keyboardNavigationHandler}
    />
  );
}
