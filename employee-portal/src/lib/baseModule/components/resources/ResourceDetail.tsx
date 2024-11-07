/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiDetailedEventWithoutCalendarId,
  ApiLabel,
  ApiResource,
  ApiUserRole,
} from "@eshg/employee-portal-api/base";
import { Add } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";

import { LabelList } from "@/lib/baseModule/components/labels/LabelList";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

import { ResourceCalendar, TimeRangeProps } from "./ResourceCalendar";
import { resourceTypeNames } from "./constants";
import {
  useAddServiceSidebar,
  useEditServiceSidebar,
} from "./sidebar/AddServiceSidebar";
import { useEventsViewSidebar } from "./sidebar/EventsViewSidebar";
import { useUpdateResourceSidebar } from "./sidebar/UpdateResourceSidebar";

export type UserActivityState =
  | { type: "add-service"; start?: string }
  | { type: "edit-data" }
  | {
      type: "view-events";
      date: Date;
      events: ApiDetailedEventWithoutCalendarId[];
    }
  | { type: "edit-service"; event: ApiDetailedEventWithoutCalendarId };

export function ResourceDetail(props: {
  resource: ApiResource;
  labels: ApiLabel[];
  resourceCalendarEvents: ApiDetailedEventWithoutCalendarId[];
  calendarId: string;
  timeRangeProps: TimeRangeProps;
  isTodayAvailable: boolean;
}) {
  const hasWritePerms = useHasUserRoleCheck(ApiUserRole.BaseResourcesWrite);

  const labels = props.labels.sort((a, b) => a.name.localeCompare(b.name));

  const updateSidebar = useUpdateResourceSidebar();
  const addServiceSidebar = useAddServiceSidebar();
  const editServiceSidebar = useEditServiceSidebar();
  const eventsViewSidebar = useEventsViewSidebar();

  function startActivity(activity: UserActivityState) {
    switch (activity.type) {
      case "add-service":
        addServiceSidebar.open({
          start: activity.start,
          resourceId: props.resource.id,
          calendarId: props.calendarId,
        });
        break;
      case "edit-service":
        editServiceSidebar.open({
          event: activity.event,
          resourceId: props.resource.id,
          calendarId: props.calendarId,
        });
        break;
      case "edit-data":
        updateSidebar.open({
          resource: props.resource,
          labels: labels,
        });
        break;
      case "view-events":
        eventsViewSidebar.open({
          date: activity.date,
          events: activity.events,
          setUserActivity: startActivity,
        });
        break;
    }
  }

  return (
    <Stack gap={2}>
      <Stack spacing={1} alignItems={"flex-end"}>
        <Button
          variant="solid"
          startDecorator={<Add />}
          onClick={() => startActivity({ type: "add-service" })}
        >
          Service eintragen
        </Button>
      </Stack>

      <Stack direction={{ xxs: "column-reverse", md: "row" }} gap={2}>
        <InformationSheet data-testid="resource-details" sx={{ flex: 2 }}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography component={"h2"} level="h3">
              Details
            </Typography>
            {hasWritePerms && (
              <EditButton
                onClick={() => startActivity({ type: "edit-data" })}
              />
            )}
          </Stack>
          <Stack gap={1}>
            <DetailsCell
              name={"name"}
              label="Name"
              value={props.resource.name}
            />
            <DetailsCell
              name={"type"}
              label="Typ"
              value={resourceTypeNames[props.resource.type]}
            />
            <DetailsCell
              name={"articleNumber"}
              label={"Artikelnummer"}
              value={props.resource.articleNumber}
            />
            {props.resource.labels.length > 0 && (
              <DetailsCell
                name={"labels"}
                label={"Labels"}
                value={
                  <LabelList labels={props.resource.labels} maxVisible={3} />
                }
              />
            )}
            <DetailsCell
              name={"description"}
              label={"Beschreibung"}
              value={props.resource.description}
            />
          </Stack>
        </InformationSheet>
        <ResourceCalendar
          resourceCalendarEvents={props.resourceCalendarEvents}
          setUserActivity={startActivity}
          timeRangeProps={props.timeRangeProps}
          isTodayAvaliable={props.isTodayAvailable}
        />
      </Stack>
    </Stack>
  );
}
