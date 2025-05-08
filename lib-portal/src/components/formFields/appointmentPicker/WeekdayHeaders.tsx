/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box } from "@mui/joy";
import { PropsWithChildren } from "react";

import { Weekday, getWeekdayShortCodes } from "./helpers";

export function WeekdayHeaders({
  showWeekdays,
  locale,
}: {
  showWeekdays?: Weekday[];
  locale: string;
}) {
  const weekdayShortCodes = getWeekdayShortCodes(locale, showWeekdays);
  return (
    <>
      {weekdayShortCodes.map((w) => (
        <WeekdayHeader key={w}>{w}</WeekdayHeader>
      ))}
    </>
  );
}

function WeekdayHeader({ children }: PropsWithChildren) {
  return (
    <Box
      role="columnheader"
      aria-label=""
      fontWeight="bold"
      justifyContent="center"
      alignItems="center"
      display="flex"
      aria-hidden
    >
      {children}
    </Box>
  );
}
