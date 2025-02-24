/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Input, InputProps, VariantProp } from "@mui/joy";
import { useEffect, useRef } from "react";
import { isDefined } from "remeda";
import { useShallow } from "zustand/react/shallow";

import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { NAVIGATE_DIRECTIONS } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/constants";
import { SetToothResultAction } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/dentalExaminationStore";
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
  const elementContext: ElementContext = {
    field: props.field,
    toothContext: props.toothContext,
  };
  const isFocused = useIsFocused(elementContext);
  const setFocus = useDentalExaminationStore((state) => state.setFocus);
  const navigate = useDentalExaminationStore((state) => state.navigate);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused) {
      input?.current?.focus();
    }
  }, [input, isFocused]);

  function handleOnFocus() {
    setFocus(elementContext);
  }

  return (
    <Input
      {...props}
      slotProps={{ input: { ref: input } }}
      value={props.result.value}
      sx={{ width: 60 }}
      color={props.result.isInvalid ? "danger" : "primary"}
      type="text"
      variant={props.variant}
      onFocus={handleOnFocus}
      onChange={(event) => {
        props.setResultAction(
          props.toothContext,
          event.target.value.toUpperCase(),
        );
      }}
      onKeyDown={(event) => {
        const direction = NAVIGATE_DIRECTIONS[event.code];

        if (isDefined(direction)) {
          navigate(direction);
        }
      }}
    />
  );
}

function useIsFocused(element: ElementContext) {
  return useDentalExaminationStore(
    useShallow((state) => equalsElement(element, state.currentFocus)),
  );
}

function equalsElement(
  elementContext: ElementContext,
  currentFocus: ElementContext,
): boolean {
  return (
    currentFocus.toothContext.quadrantNumber ===
      elementContext.toothContext.quadrantNumber &&
    currentFocus.toothContext.toothIndex ===
      elementContext.toothContext.toothIndex &&
    currentFocus.field === elementContext.field
  );
}
