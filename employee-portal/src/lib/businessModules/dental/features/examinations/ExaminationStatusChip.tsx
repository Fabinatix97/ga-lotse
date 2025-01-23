/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, ChipProps } from "@mui/joy";

import { ExaminationStatus } from "@/lib/businessModules/dental/api/models/ExaminationStatus";

import { EXAMINATION_STATUS } from "./translations";

const examinationStatusColors: Record<ExaminationStatus, ChipProps["color"]> = {
  OPEN: "neutral",
  CLOSED: "success",
};

interface ExaminationStatusChipProps {
  status: ExaminationStatus;
}

export function ExaminationStatusChip(props: ExaminationStatusChipProps) {
  return (
    <Chip color={examinationStatusColors[props.status]}>
      {EXAMINATION_STATUS[props.status]}
    </Chip>
  );
}
