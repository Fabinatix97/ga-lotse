/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, styled } from "@mui/joy";

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
}

export function ToothColumn({
  tooth,
  index,
  quadrantNumber,
}: ToothColumnProps) {
  return (
    <ToothColumnStack
      key={tooth.toothNumber}
      component="fieldset"
      gap={2}
      alignItems="center"
    >
      <ToothNumber toothNumber={tooth.toothNumber} />
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
