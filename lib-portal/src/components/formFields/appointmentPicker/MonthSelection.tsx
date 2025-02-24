/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton, IconButtonProps, Typography } from "@mui/joy";
import { addMonths, startOfMonth } from "date-fns";
import { useId } from "react";

import { Row } from "../../Row";

import { monthLabel } from "./helpers";

export interface MonthSelectionProps {
  currentMonth: Date;
  setCurrentMonth: (d: Date) => void;
  label: string;
  nextMonthLabel: string;
  prevMonthLabel: string;
  slots?: {
    arrows?: IconButtonProps;
  };
}
export function MonthSelection({
  currentMonth,
  setCurrentMonth,
  label,
  nextMonthLabel,
  prevMonthLabel,
  slots,
}: MonthSelectionProps) {
  const monthYearId = useId();
  const previousMonth = addMonths(currentMonth, -1);
  const now = new Date();
  const nowMonth = startOfMonth(now);
  return (
    <Row justifyContent="space-between" width="100%" alignItems="center">
      <Typography level="title-md" id={monthYearId} aria-label={label}>
        {monthLabel(currentMonth)}
      </Typography>
      <Row gap={2}>
        <IconButton
          size="sm"
          color="primary"
          variant="outlined"
          title={prevMonthLabel}
          aria-controls={monthYearId}
          onClick={() => setCurrentMonth(previousMonth)}
          disabled={previousMonth < nowMonth}
          {...slots?.arrows}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          size="sm"
          color="primary"
          variant="outlined"
          title={nextMonthLabel}
          aria-controls={monthYearId}
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          {...slots?.arrows}
        >
          <ChevronRight />
        </IconButton>
      </Row>
    </Row>
  );
}
