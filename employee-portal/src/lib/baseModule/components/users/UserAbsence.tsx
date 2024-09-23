/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiDetailedEventWithoutCalendarId,
  ApiEventType,
} from "@eshg/employee-portal-api/base";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import DateRangeIcon from "@mui/icons-material/DateRangeOutlined";
import { List, ListItem, Sheet, Stack, Typography } from "@mui/joy";

import { routes } from "@/lib/baseModule/shared/routes";
import { formatDateOrDateTimeRange } from "@/lib/shared/helpers/dateTime";

export function UserAbsence({
  events,
  isSelf,
}: {
  events: ApiDetailedEventWithoutCalendarId[];
  isSelf: boolean;
}) {
  const absences = events.filter(
    (event) => event.type === ApiEventType.Vacation,
  );

  return (
    <Sheet
      component={"section"}
      aria-labelledby={"user-profile-absence-header"}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        flex: { xxs: 1, md: "0 1 440px" },
      }}
    >
      <Typography
        level={"h3"}
        component={"h2"}
        id={"user-profile-absence-header"}
      >
        Abwesenheit
      </Typography>
      <Stack
        justifyContent={"space-between"}
        gap={"inherit"}
        height={"100%"}
        sx={(theme) => ({
          backgroundColor: theme.palette.background.level1,
          borderRadius: theme.radius.md,
          padding: theme.spacing(2),
        })}
      >
        {absences.length > 0 ? (
          <List marker="disc">
            {absences.map((absence) => (
              <ListItem key={absence.id}>
                {formatDateOrDateTimeRange(absence.timeData)}
              </ListItem>
            ))}
          </List>
        ) : (
          <Stack
            gap={1}
            flex={1}
            alignItems={"center"}
            justifyContent={"center"}
            flexBasis={"150px"}
          >
            <DateRangeIcon size={"lg"} />
            <Typography>Keine Abwesenheiten eingetragen</Typography>
          </Stack>
        )}
      </Stack>
      {isSelf && (
        <InternalLinkButton href={routes.calendar}>
          Zum Kalender
        </InternalLinkButton>
      )}
    </Sheet>
  );
}
