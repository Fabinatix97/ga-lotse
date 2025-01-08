/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiHistoryEntryType } from "@eshg/employee-portal-api/base";
import AddIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditIcon from "@mui/icons-material/EditOutlined";
import { StepIndicatorProps } from "@mui/joy/StepIndicator/StepIndicatorProps";
import { createElement } from "react";

import { TimelineEntryIndicator } from "@/lib/shared/components/timeline/TimelineEntryIndicator";

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
  entryType: ApiHistoryEntryType;
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
