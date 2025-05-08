/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { useExaminationStore } from "../../stores/examination/ExaminationStoreProvider";
import { QuadrantNumber } from "../../stores/examination/types";

import { ToothColumn } from "./ToothColumn";
import { QUADRANT_SPACING } from "./styles";

const VERTICAL_ALIGN: Record<QuadrantNumber, VerticalAlignment> = {
  Q1: "top",
  Q2: "top",
  Q3: "bottom",
  Q4: "bottom",
};

type VerticalAlignment = "top" | "bottom";

interface QuadrantFormProps {
  titleId: string;
  quadrantNumber: QuadrantNumber;
}

export function QuadrantForm(props: QuadrantFormProps) {
  const dentition = useExaminationStore((state) => state.dentition);
  const verticalAlign = VERTICAL_ALIGN[props.quadrantNumber];

  return (
    <Stack
      component="section"
      direction="row"
      gap={2}
      marginTop={verticalAlign === "top" ? 0 : QUADRANT_SPACING}
      marginBottom={verticalAlign === "bottom" ? 0 : QUADRANT_SPACING}
      aria-labelledby={props.titleId}
    >
      {dentition[props.quadrantNumber].teeth.map((tooth, index) => (
        <ToothColumn
          key={tooth.toothNumber}
          tooth={tooth}
          index={index}
          quadrantNumber={props.quadrantNumber}
        />
      ))}
    </Stack>
  );
}
