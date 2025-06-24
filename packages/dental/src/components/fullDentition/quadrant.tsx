/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { useExaminationStore } from "../../stores/examination/ExaminationStoreProvider";
import { isInUpperJaw } from "../../stores/examination/actions/utils";
import { QuadrantNumber } from "../../stores/examination/types";

import { ToothColumn } from "./ToothColumn";
import { QUADRANT_SPACING } from "./styles";

interface QuadrantFormProps {
  titleId: string;
  quadrantNumber: QuadrantNumber;
}

export function QuadrantForm(props: QuadrantFormProps) {
  const dentition = useExaminationStore((state) => state.dentition);
  const inUpperJaw = isInUpperJaw(props.quadrantNumber);

  return (
    <Stack
      component="section"
      direction="row"
      gap={2}
      alignSelf={inUpperJaw ? "flex-end" : "flex-start"}
      marginTop={inUpperJaw ? 0 : QUADRANT_SPACING}
      marginBottom={inUpperJaw ? QUADRANT_SPACING : 0}
      aria-labelledby={props.titleId}
    >
      {dentition[props.quadrantNumber].teeth.map((tooth, index) => (
        <ToothColumn
          key={tooth.toothNumber}
          tooth={tooth}
          index={index}
          quadrantNumber={props.quadrantNumber}
          reverse={inUpperJaw}
        />
      ))}
    </Stack>
  );
}
