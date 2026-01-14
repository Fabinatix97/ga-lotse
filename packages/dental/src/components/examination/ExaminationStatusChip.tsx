/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, ChipProps, Typography } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";

import { ExaminationStatus } from "../../api/models/ExaminationStatus";
import { EXAMINATION_STATUS } from "../../translations/examination";

const examinationStatusColors: Record<ExaminationStatus, ChipProps["color"]> = {
  OPEN: "neutral",
  CLOSED: "success",
  NOT_PRESENT: "danger",
};

interface ExaminationStatusChipProps {
  status: ExaminationStatus;
  invisibleStatusLabel?: boolean;
}

export function ExaminationStatusChip(props: ExaminationStatusChipProps) {
  return (
    <Chip color={examinationStatusColors[props.status]}>
      {props.invisibleStatusLabel && (
        <Typography component="span" sx={visuallyHidden}>
          Status:
        </Typography>
      )}
      {EXAMINATION_STATUS[props.status]}
    </Chip>
  );
}
