/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { ReactNode } from "react";

import { useExaminationStore } from "@/stores/examination/ExaminationStoreProvider";
import { QuadrantNumber, Tooth } from "@/stores/examination/types";

import { ToothColumn } from "./ToothColumn";

interface QuadrantProps {
  quadrantNumber: QuadrantNumber;
  children?: (tooth: Tooth, index: number) => ReactNode;
  gap?: number;
  "aria-labelledby"?: string;
}

export function Quadrant(props: QuadrantProps) {
  const dentition = useExaminationStore((state) => state.dentition);
  return (
    <Stack
      component="section"
      gap={props.gap ?? 1}
      direction="row"
      aria-labelledby={props["aria-labelledby"]}
    >
      {dentition[props.quadrantNumber].teeth.map(
        (tooth, index) =>
          props.children?.(tooth, index) ?? (
            <ToothColumn
              key={tooth.toothNumber}
              tooth={tooth}
              index={index}
              quadrantNumber={props.quadrantNumber}
            />
          ),
      )}
    </Stack>
  );
}
