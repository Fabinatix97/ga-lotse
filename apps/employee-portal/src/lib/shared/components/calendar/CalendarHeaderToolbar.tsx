/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { CalendarApi } from "@fullcalendar/core";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Option,
  Select,
  SelectProps,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

export interface CalendarHeaderToolbarProps<ViewType> {
  title: string | undefined;
  viewType: ViewType;
  buttons?: ReactNode;
  goToToday: CalendarApi["today"];
  goToPrevious: CalendarApi["prev"];
  goToNext: CalendarApi["next"];
  options: {
    value: ViewType;
    label: string;
  }[];
  slotProps?: {
    select?: Pick<SelectProps<string, false>, "aria-label" | "placeholder">;
  };
  renderNavigationLabel: (
    navItem: "prev" | "next",
    viewType: ViewType,
  ) => string;
  onViewTypeChange: (viewType: ViewType) => void;
}

type GenericViewType =
  | "dayGridMonth"
  | "listMonth"
  | "timeGridWeek"
  | "timeGridDay";
export function renderToolbarNavigationLabel(
  navItem: "prev" | "next",
  viewType: GenericViewType,
): string {
  const isPrevLabel = navItem === "prev";
  switch (viewType) {
    case "dayGridMonth":
    case "listMonth":
      return isPrevLabel ? "Vorheriger Monat" : "Nächster Monat";
    case "timeGridWeek":
      return isPrevLabel ? "Vorherige Woche" : "Nächste Woche";
    case "timeGridDay":
      return isPrevLabel ? "Vorheriger Tag" : "Nächster Tag";
  }
}

export function CalendarHeaderToolbar<ViewType extends string>(
  props: CalendarHeaderToolbarProps<ViewType>,
) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap={1}
      flexWrap="wrap"
    >
      <Stack direction="row" gap={1} alignItems="center">
        <Button color="neutral" variant="outlined" onClick={props.goToToday}>
          Heute
        </Button>
        <Tooltip
          title={props.renderNavigationLabel("prev", props.viewType)}
          arrow
          placement="bottom"
        >
          <IconButton
            color="primary"
            variant="outlined"
            aria-label={props.renderNavigationLabel("prev", props.viewType)}
            onClick={props.goToPrevious}
          >
            <ChevronLeft />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={props.renderNavigationLabel("next", props.viewType)}
          arrow
          placement="bottom"
        >
          <IconButton
            color="primary"
            variant="outlined"
            aria-label={props.renderNavigationLabel("next", props.viewType)}
            onClick={props.goToNext}
          >
            <ChevronRight />
          </IconButton>
        </Tooltip>
        {isDefined(props.title) && (
          <Typography
            component="h2"
            level="h4"
            textColor="text.secondary"
            aria-live="polite"
          >
            {props.title}
          </Typography>
        )}
      </Stack>
      <Stack direction="row" gap={2} flexWrap="wrap">
        <Select
          {...props.slotProps?.select}
          color="primary"
          size="md"
          sx={{ width: "13.5rem" }}
          value={props.viewType}
          onChange={(_, value) => {
            if (value) {
              props.onViewTypeChange(value);
            }
          }}
        >
          {props.options.map(({ label, value }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>

        {props.buttons}
      </Stack>
    </Stack>
  );
}
