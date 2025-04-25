/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { flatMap, map, pipe, uniqueBy } from "remeda";

import {
  ApiGetRelevantCalendarsResponse,
  ApiUserGroupCalendarInfo,
} from "@eshg/base-api";
import { formatUserName } from "@eshg/lib-portal/formatters/person";

import { theme } from "@/lib/baseModule/theme/theme";
import { translateUserGroup } from "@/lib/shared/helpers/users";

const calendarColors = {
  currentUser: theme.palette.primary[300],
  global: theme.palette.warning[300],
  calendar3: theme.palette.neutral[300],
  calendar4: "#ffae9b",
  calendar5: "#F49CD2",
  calendar6: theme.palette.success[300],
  calendar7: "#ffd175",
  calendar8: "#B39DDB",
  calendar9: theme.palette.danger[300],
  calendar10: theme.palette.primary[200],
};

const groupCalendarColors = [
  calendarColors.calendar3,
  calendarColors.calendar4,
  calendarColors.calendar5,
  calendarColors.calendar6,
  calendarColors.calendar7,
  calendarColors.calendar8,
  calendarColors.calendar9,
  calendarColors.calendar10,
];

function getOrderedCalendarColor(index: number) {
  return groupCalendarColors[index % groupCalendarColors.length]!;
}

export interface CalendarInfo {
  id: string;
  name: string;
  color: string;
  /**
   * Names of user groups this user calendar belongs to.
   * Global calendars and the calendar of the current user don't have this property.
   */
  groupNames?: string[];
}

function getGroupNamesByCalenderId(
  userGroupCalendarInfos: ApiUserGroupCalendarInfo[],
  calendarId: string,
): string[] {
  return userGroupCalendarInfos
    .filter((info) =>
      info.userCalendars.some((calendar) => calendar.calendarId === calendarId),
    )
    .map((info) => translateUserGroup(info.groupName));
}

export function mapApiCalendarsToCalendarInfo({
  currentUserCalendar,
  globalCalendars,
  userGroupCalendarInfos,
  resolvedUsers,
}: ApiGetRelevantCalendarsResponse) {
  const currentUserCalendarInfo: CalendarInfo = {
    id: currentUserCalendar.calendarId,
    name: "Mein Kalender",
    color: calendarColors.currentUser,
  };

  const globalCalendarInfos: CalendarInfo[] = globalCalendars.map(
    (calendar) => ({
      id: calendar.calendarId,
      name: calendar.globalCalendarName,
      color: calendarColors.global,
    }),
  );

  const userCalendarInfos: CalendarInfo[] = pipe(
    userGroupCalendarInfos,
    flatMap((info) => info.userCalendars),
    uniqueBy((calendar) => calendar.calendarId),
    map((calendar, index) => ({
      id: calendar.calendarId,
      name: formatUserName(resolvedUsers[calendar.userId]),
      color: getOrderedCalendarColor(index),
      groupNames: getGroupNamesByCalenderId(
        userGroupCalendarInfos,
        calendar.calendarId,
      ),
    })),
  );

  return {
    userCalendarId: currentUserCalendar.calendarId,
    calendars: [
      currentUserCalendarInfo,
      ...globalCalendarInfos,
      ...userCalendarInfos,
    ],
  };
}
