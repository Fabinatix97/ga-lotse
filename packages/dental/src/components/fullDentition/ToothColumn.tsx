/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, styled } from "@mui/joy";
import { useId } from "react";

import {
  QuadrantNumber,
  Tooth,
  isToothWithDiagnosis,
} from "../../stores/examination/types";

import { ToothForm } from "./ToothForm";
import { ToothNumber } from "./ToothNumber";
import { AddToothButton } from "./toothIconButtons";

const ToothColumnStack = styled(Stack)({
  padding: 0,
  margin: 0,
  border: 0,
}) as typeof Stack;

interface ToothColumnProps {
  quadrantNumber: QuadrantNumber;
  tooth: Tooth;
  index: number;
  reverse?: boolean;
}

export function ToothColumn({
  tooth,
  index,
  quadrantNumber,
  reverse,
}: ToothColumnProps) {
  const toothNumberId = useId();

  return (
    <ToothColumnStack
      key={tooth.toothNumber}
      role="group"
      direction={reverse ? "column-reverse" : "column"}
      gap={2}
      alignItems="center"
      aria-labelledby={toothNumberId}
    >
      <ToothNumber id={toothNumberId} toothNumber={tooth.toothNumber} />
      {isToothWithDiagnosis(tooth) ? (
        <ToothForm
          quadrantNumber={quadrantNumber}
          index={index}
          tooth={tooth}
        />
      ) : (
        <AddToothButton index={index} quadrantNumber={quadrantNumber} />
      )}
    </ToothColumnStack>
  );
}
