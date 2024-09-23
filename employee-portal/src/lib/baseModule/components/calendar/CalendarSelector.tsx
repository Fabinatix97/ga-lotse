/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Checkbox, Stack, Typography, checkboxClasses } from "@mui/joy";
import { Dispatch, SetStateAction } from "react";
import { isNonNullish, isNullish, unique } from "remeda";

import {
  SearchableGroup,
  SearchableGroupItem,
  SearchableGroups,
} from "@/lib/shared/components/SearchableGroups";

import { CalendarInfo } from "./calendarDisplay";

type CalendarGroupItem = SearchableGroupItem & {
  calendar: CalendarInfo;
};

export function CalendarSelector(props: {
  calendars: CalendarInfo[];
  displayedCalendarIds: string[];
  setDisplayedCalendarIds: Dispatch<SetStateAction<string[]>>;
}) {
  const groupNames = unique(
    props.calendars.flatMap((calendar) => calendar.groupNames ?? []),
  );
  const calendarGroups: SearchableGroup<CalendarGroupItem>[] = groupNames.map(
    (name) => ({
      name,
      inAccordion: true,
      items: props.calendars
        .filter(
          (calendar) =>
            isNonNullish(calendar.groupNames) &&
            calendar.groupNames.includes(name),
        )
        .map<CalendarGroupItem>((calendar) => ({
          calendar,
          key: calendar.id,
          searchableValue: calendar.name,
        })),
    }),
  );

  function toggleCalendarVisibility(calendarId: string) {
    props.setDisplayedCalendarIds((previousIds) => {
      if (previousIds.includes(calendarId)) {
        return previousIds.filter((id) => id !== calendarId);
      } else {
        return [...previousIds, calendarId];
      }
    });
  }

  return (
    <Stack spacing={5}>
      <Stack spacing={2}>
        <Typography level="h4" component="h2">
          Meine Kalender
        </Typography>
        {props.calendars
          .filter((calendar) => isNullish(calendar.groupNames))
          .map((calendar) => (
            <CalendarSettingCheckbox
              key={calendar.id}
              calendar={calendar}
              checked={props.displayedCalendarIds.includes(calendar.id)}
              onChange={() => toggleCalendarVisibility(calendar.id)}
            />
          ))}
      </Stack>

      {calendarGroups.length > 0 && (
        <SearchableGroups
          groups={calendarGroups}
          label="Teams"
          placeholder="Mitarbeiter Suchen"
          renderItem={(item) => (
            <CalendarSettingCheckbox
              calendar={item.calendar}
              checked={props.displayedCalendarIds.includes(item.calendar.id)}
              onChange={() => toggleCalendarVisibility(item.calendar.id)}
            />
          )}
        />
      )}
    </Stack>
  );
}

function CalendarSettingCheckbox(props: {
  calendar: CalendarInfo;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <Checkbox
      sx={(theme) => ({
        "--variant-solidBg": props.calendar.color,
        "--variant-solidHoverBg": theme.palette.primary.outlinedHoverBg,
        "--variant-solidActiveBg": theme.palette.primary.outlinedHoverBg,
        width: "100%",
        [`& > .${checkboxClasses.checkbox}`]: {
          border: `1px solid ${props.calendar.color}`,
        },
        [`& > .${checkboxClasses.checked}:hover`]: {
          backgroundColor: props.calendar.color,
        },
      })}
      label={props.calendar.name}
      checked={props.checked}
      onChange={props.onChange}
    />
  );
}
