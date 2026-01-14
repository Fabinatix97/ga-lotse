/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Checkbox,
  Stack,
  Typography,
  checkboxClasses,
  useTheme,
} from "@mui/joy";
import { Dispatch, SetStateAction } from "react";
import { isNonNullish, isNullish, unique } from "remeda";

import {
  SearchableGroup,
  SearchableGroupItem,
  SearchableGroups,
} from "@eshg/lib-employee-portal";

import { CalendarInfo } from "./calendarDisplay";

type CalendarGroupItemCalender = SearchableGroupItem & {
  type: "ITEM";
  calendar: CalendarInfo;
};

type CalendarGroupItemAll = SearchableGroupItem & {
  type: "ALL";
  calendarIds: string[];
};

type CalendarGroupItem = CalendarGroupItemCalender | CalendarGroupItemAll;

export function CalendarSelector(props: {
  calendars: CalendarInfo[];
  displayedCalendarIds: string[];
  setDisplayedCalendarIds: Dispatch<SetStateAction<string[]>>;
}) {
  const groupNames = unique(
    props.calendars.flatMap((calendar) => calendar.groupNames ?? []),
  );
  const theme = useTheme();

  const calendarGroups: SearchableGroup<CalendarGroupItem>[] = groupNames.map(
    (name) => {
      const items = props.calendars
        .filter(
          (calendar) =>
            isNonNullish(calendar.groupNames) &&
            calendar.groupNames.includes(name),
        )
        .map<CalendarGroupItemCalender>((calendar) => ({
          type: "ITEM",
          calendar,
          key: calendar.id,
          searchableValue: calendar.name,
        }));

      return {
        name,
        inAccordion: true,
        items: [
          {
            type: "ALL",
            calendarIds: items.map((it) => it.calendar.id),
            key: "SELECT_ALL",
            searchableValue: "",
          },
          ...items,
        ],
      };
    },
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
              hasMargin={false}
              onChange={() => toggleCalendarVisibility(calendar.id)}
            />
          ))}
      </Stack>

      {calendarGroups.length > 0 && (
        <SearchableGroups
          groups={calendarGroups}
          label="Teams"
          searchLabel="Mitarbeiter:in"
          labelComponent="h2"
          renderItem={(item) => {
            if (item.type === "ALL") {
              const everyItemSelected = item.calendarIds.every((it) =>
                props.displayedCalendarIds.includes(it),
              );
              const someItemSelected =
                everyItemSelected ||
                item.calendarIds.some((it) =>
                  props.displayedCalendarIds.includes(it),
                );

              return (
                <CalendarSettingCheckbox
                  calendar={{
                    id: "ALLE_ANZEIGEN",
                    name: "Alle anzeigen",
                    color: theme.palette.primary.plainColor,
                  }}
                  indeterminate={someItemSelected && !everyItemSelected}
                  checked={everyItemSelected}
                  hasMargin={false}
                  onChange={() => {
                    if (everyItemSelected) {
                      props.setDisplayedCalendarIds((previousCalenderIds) =>
                        previousCalenderIds.filter(
                          (it) => !item.calendarIds.includes(it),
                        ),
                      );
                    } else {
                      props.setDisplayedCalendarIds((previousCalenderIds) => [
                        ...new Set([
                          ...previousCalenderIds,
                          ...item.calendarIds,
                        ]).values(),
                      ]);
                    }
                  }}
                />
              );
            }

            return (
              <CalendarSettingCheckbox
                calendar={item.calendar}
                checked={props.displayedCalendarIds.includes(item.calendar.id)}
                hasMargin
                onChange={() => toggleCalendarVisibility(item.calendar.id)}
              />
            );
          }}
        />
      )}
    </Stack>
  );
}

function CalendarSettingCheckbox(props: {
  calendar: CalendarInfo;
  checked: boolean;
  onChange: () => void;
  indeterminate?: boolean;
  hasMargin: boolean;
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
        marginLeft: props.hasMargin ? theme.spacing(3) : undefined,
      })}
      indeterminate={props.indeterminate}
      label={props.calendar.name}
      checked={props.checked}
      onChange={props.onChange}
    />
  );
}
