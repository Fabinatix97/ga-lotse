/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Input, VariantProp } from "@mui/joy";
import { useEffect, useRef } from "react";

import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { SetToothResultAction } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/dentalExaminationStore";
import {
  FieldVariant,
  QuadrantNumber,
  ToothResult,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

interface ResultInputFieldProps {
  quadrantNumber: QuadrantNumber;
  index: number;
  setResultAction: SetToothResultAction;
  field: FieldVariant;
  result: ToothResult;
  variant?: VariantProp;
}

export function ResultInputField(props: ResultInputFieldProps) {
  const focus = useDentalExaminationStore((state) => state.focus);
  const setFocus = useDentalExaminationStore((state) => state.setFocus);
  const input = useRef<HTMLInputElement>(null);

  const { quadrantNumber, toothIndex } = focus.toothContext;
  const focusReferencesThisInput =
    quadrantNumber === props.quadrantNumber &&
    toothIndex === props.index &&
    focus.field === props.field;

  useEffect(() => {
    if (focusReferencesThisInput) {
      input?.current?.focus();
    }
  }, [input, focusReferencesThisInput]);

  function handleOnFocus() {
    if (!focusReferencesThisInput) {
      setFocus({
        toothContext: {
          quadrantNumber: props.quadrantNumber,
          toothIndex: props.index,
        },
        field: props.field,
      });
    }
  }

  return (
    <Input
      slotProps={{ input: { ref: input } }}
      value={props.result.value}
      sx={{ width: 60 }}
      color={props.result.isInvalid ? "danger" : "primary"}
      type="text"
      variant={props.variant}
      onFocus={handleOnFocus}
      onChange={(event) => {
        props.setResultAction(
          {
            quadrantNumber: props.quadrantNumber,
            toothIndex: props.index,
          },
          event.target.value.toUpperCase(),
        );
      }}
    />
  );
}
