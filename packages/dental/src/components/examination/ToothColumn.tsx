/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import {
  QuadrantNumber,
  Tooth,
  isToothWithDiagnosis,
} from "@/stores/examination/types";

import { ToothForm } from "./ToothForm";
import { AddToothButton } from "./ToothIconButtons";
import { ToothNumber } from "./ToothNumber";

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
    <Stack
      component="fieldset"
      key={tooth.toothNumber}
      sx={{ gap: 2, alignItems: "center", padding: 0, margin: 0, border: 0 }}
    >
      <ToothNumber tooth={tooth} sx={{ marginBottom: 2 }} />
      {isToothWithDiagnosis(tooth) ? (
        <ToothForm
          quadrantNumber={quadrantNumber}
          index={index}
          tooth={tooth}
        />
      ) : (
        <AddToothButton index={index} quadrantNumber={quadrantNumber} />
      )}
    </Stack>
  );
}
