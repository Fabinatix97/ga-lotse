/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CalendarApi } from "@fullcalendar/core";
import { Add, ChevronLeft, ChevronRight, Settings } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Option,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";

import { CalendarViewType, CalendarViewTypes } from "./calendarViews";

export function HeaderToolbar(props: {
  title: string;
  viewType: CalendarViewType;
  goToToday: CalendarApi["today"];
  goToPrevious: CalendarApi["prev"];
  goToNext: CalendarApi["next"];
  onViewTypeChange: (viewType: CalendarViewType) => void;
  onNewEventButtonClick: () => void;
  onSettingsButtonClick: () => void;
}) {
  function previousIconLabel(): string {
    switch (props.viewType) {
      case CalendarViewTypes.DayGridMonth:
      case CalendarViewTypes.ListMonth:
        return "Vorheriger Monat";
      case CalendarViewTypes.TimeGridWeek:
        return "Vorherige Woche";
      case CalendarViewTypes.TimeGridDay:
        return "Vorheriger Tag";
    }
  }

  function nextIconLabel(): string {
    switch (props.viewType) {
      case CalendarViewTypes.DayGridMonth:
      case CalendarViewTypes.ListMonth:
        return "Nächster Monat";
      case CalendarViewTypes.TimeGridWeek:
        return "Nächste Woche";
      case CalendarViewTypes.TimeGridDay:
        return "Nächster Tag";
    }
  }

  const settingsLabel = "Kalender Einstellungen";

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
        <Tooltip title={previousIconLabel()} arrow placement="bottom">
          <IconButton
            color="primary"
            variant="outlined"
            aria-label={previousIconLabel()}
            onClick={props.goToPrevious}
          >
            <ChevronLeft />
          </IconButton>
        </Tooltip>
        <Tooltip title={nextIconLabel()} arrow placement="bottom">
          <IconButton
            color="primary"
            variant="outlined"
            aria-label={nextIconLabel()}
            onClick={props.goToNext}
          >
            <ChevronRight />
          </IconButton>
        </Tooltip>
        <Typography component="h2" level="h4" textColor="text.secondary">
          {props.title}
        </Typography>
      </Stack>
      <Stack direction="row" gap={2} flexWrap="wrap">
        <Select
          aria-label="Kalendaransicht"
          color="primary"
          size="md"
          sx={{
            width: "13.5rem",
          }}
          placeholder="Monat"
          value={props.viewType}
          onChange={(_, value) => {
            if (value) {
              props.onViewTypeChange(value);
            }
          }}
        >
          <Option value={CalendarViewTypes.DayGridMonth}>Monat</Option>
          <Option value={CalendarViewTypes.TimeGridWeek}>Woche</Option>
          <Option value={CalendarViewTypes.TimeGridDay}>Tag</Option>
          <Option value={CalendarViewTypes.ListMonth}>Terminübersicht</Option>
        </Select>
        <Button startDecorator={<Add />} onClick={props.onNewEventButtonClick}>
          Neue Abwesenheit
        </Button>
        <Tooltip title={settingsLabel} arrow placement="bottom">
          <IconButton
            color="primary"
            variant="outlined"
            aria-label={settingsLabel}
            onClick={props.onSettingsButtonClick}
          >
            <Settings sx={{ fontSize: "var(--joy-fontSize-xl)" }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
