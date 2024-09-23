/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import AddIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditIcon from "@mui/icons-material/EditOutlined";
import EmptyIcon from "@mui/icons-material/SentimentDissatisfied";
import { StepIndicatorProps } from "@mui/joy/StepIndicator/StepIndicatorProps";
import { createElement } from "react";

import { TimelineEntryIndicator } from "@/lib/components/timeline/TimelineEntryIndicator";
import { RevisionType } from "@/lib/types/audit";

const iconByType = {
  ADD: AddIcon,
  MOD: EditIcon,
  DEL: DeleteIcon,
} as const;

const colors = {
  ADD: "primary",
  MOD: "primary",
  DEL: "danger",
} as const;

type HistoryEntryIndicatorProps = StepIndicatorProps & {
  entryType: RevisionType;
};

export function HistoryEntryIndicator({
  entryType,
  ...indicatorProps
}: HistoryEntryIndicatorProps) {
  const color = colors[entryType];

  return (
    <TimelineEntryIndicator {...indicatorProps} color={color}>
      {createElement(iconByType[entryType])}
    </TimelineEntryIndicator>
  );
}

export function EmptyHistoryEntryIndicator({
  ...indicatorProps
}: StepIndicatorProps) {
  return (
    <TimelineEntryIndicator {...indicatorProps} color="danger">
      <EmptyIcon />
    </TimelineEntryIndicator>
  );
}
