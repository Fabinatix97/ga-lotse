/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Input } from "@mui/joy";

import { SoftRequiredInput } from "@eshg/lib-portal";

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
  isTabFocusable?: boolean;
  setResultAction: SetToothResultAction;
  "aria-labelledby": string;
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
    (input: HTMLInputElement) => input.select(),
  );

  const keyboardNavigationHandler = useKeyboardNavigationHandler();

  return (
    <InputComponent
      {...inputProps}
      slotProps={{
        input: {
          ref: elementRef,
          tabIndex: props.isTabFocusable ? 0 : -1,
          "aria-invalid": result.isInvalid,
        },
      }}
      value={result.value}
      sx={{ width: 60 }}
      color={
        result.isInvalid ? "danger" : isMainResultField ? "primary" : "neutral"
      }
      type="text"
      onChange={(event) =>
        setResultAction(toothContext, normalizeValue(event.target.value))
      }
      onFocus={focusHandler}
      onBlur={blurHandler}
      onKeyDown={keyboardNavigationHandler}
    />
  );
}

function normalizeValue(value: string): string {
  return value.trim().toUpperCase();
}
