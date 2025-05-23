/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton, IconButtonProps, Typography } from "@mui/joy";
import { addMonths, startOfMonth } from "date-fns";
import { RefObject, useId } from "react";

import { Row } from "../../Row";

import { monthLabel } from "./helpers";

export interface MonthSelectionProps {
  currentMonth: Date;
  setCurrentMonth: (d: Date) => void;
  label: string;
  nextMonthLabel: string;
  prevMonthLabel: string;
  slotProps?: {
    arrows?: IconButtonProps;
  };
  locale: string;
  prevButtonRef?: RefObject<HTMLButtonElement | null>;
  nextButtonRef?: RefObject<HTMLButtonElement | null>;
}
export function MonthSelection({
  currentMonth,
  setCurrentMonth,
  label,
  nextMonthLabel,
  prevMonthLabel,
  slotProps,
  locale,
  nextButtonRef,
  prevButtonRef,
}: MonthSelectionProps) {
  const monthYearId = useId();
  const previousMonth = addMonths(currentMonth, -1);
  const now = new Date();
  const nowMonth = startOfMonth(now);
  return (
    <Row justifyContent="space-between" width="100%" alignItems="center">
      <Typography level="title-md" id={monthYearId} aria-label={label}>
        {monthLabel(currentMonth, locale)}
      </Typography>
      <Row gap={2}>
        <IconButton
          ref={prevButtonRef}
          size="sm"
          color="primary"
          variant="outlined"
          title={prevMonthLabel}
          aria-controls={monthYearId}
          disabled={previousMonth < nowMonth}
          onClick={() => setCurrentMonth(previousMonth)}
          {...slotProps?.arrows}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          ref={nextButtonRef}
          size="sm"
          color="primary"
          variant="outlined"
          title={nextMonthLabel}
          aria-controls={monthYearId}
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          {...slotProps?.arrows}
        >
          <ChevronRight />
        </IconButton>
      </Row>
    </Row>
  );
}
