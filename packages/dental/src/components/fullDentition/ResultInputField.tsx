/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Input } from "@mui/joy";

import { SoftRequiredInput } from "@eshg/lib-portal/components/form/fieldVariants";

import { SetToothResultAction } from "../../stores/examination/examinationStore";
import { useElementFocus } from "../../stores/examination/hooks/useElementFocus";
import { useKeyboardNavigationHandler } from "../../stores/examination/hooks/useKeyboardNavigationHandler";
import {
  ElementContext,
  ToothContext,
  ToothFieldElement,
  ToothResult,
} from "../../stores/examination/types";

interface ResultInputFieldProps {
  field: ToothFieldElement;
  result: ToothResult;
  toothContext: ToothContext;
  setResultAction: SetToothResultAction;
  "aria-label": string;
}

export function ResultInputField(props: ResultInputFieldProps) {
  const { field, result, toothContext, setResultAction, ...inputProps } = props;
  const isMainResultField = field === "mainResultField";
  const InputComponent = isMainResultField ? SoftRequiredInput : Input;
  const fieldContext: ElementContext = {
    toothContext,
    element: field,
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
    <InputComponent
      {...inputProps}
      slotProps={{
        input: {
          ref: elementRef,
          "aria-invalid": result.isInvalid,
        },
      }}
      value={result.value}
      sx={{ width: 60 }}
      color={
        result.isInvalid ? "danger" : isMainResultField ? "primary" : "neutral"
      }
      type="text"
      onChange={(event) => {
        setResultAction(toothContext, event.target.value.toUpperCase());
      }}
      onFocus={focusHandler}
      onBlur={blurHandler}
      onKeyDown={keyboardNavigationHandler}
    />
  );
}
