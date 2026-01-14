/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CalendarApi } from "@fullcalendar/core";
import { Add, Settings } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/joy";

import {
  CalendarHeaderToolbar,
  renderToolbarNavigationLabel,
} from "@/lib/shared/components/calendar/CalendarHeaderToolbar";

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
  const settingsLabel = "Kalender Einstellungen";
  return (
    <CalendarHeaderToolbar
      title={props.title}
      slotProps={{
        select: { "aria-label": "Kalenderansicht", placeholder: "Monat" },
      }}
      viewType={props.viewType}
      goToToday={props.goToToday}
      goToPrevious={props.goToPrevious}
      goToNext={props.goToNext}
      options={[
        { value: CalendarViewTypes.DayGridMonth, label: "Monat" },
        { value: CalendarViewTypes.TimeGridWeek, label: "Woche" },
        { value: CalendarViewTypes.TimeGridDay, label: "Tag" },
        { value: CalendarViewTypes.ListMonth, label: "Terminübersicht" },
      ]}
      renderNavigationLabel={renderToolbarNavigationLabel}
      buttons={
        <>
          <Button
            startDecorator={<Add />}
            onClick={props.onNewEventButtonClick}
          >
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
        </>
      }
      onViewTypeChange={props.onViewTypeChange}
    />
  );
}
