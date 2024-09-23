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
import { useState } from "react";

import { LabelList } from "@/lib/baseModule/components/labels/LabelList";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { formatDateToFullReadableStringWithShortenedWeekday } from "@/lib/shared/helpers/dateTime";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

import { ResourceCalendar, TimeRangeProps } from "./ResourceCalendar";
import { resourceTypeNames } from "./constants";
import {
  AddServiceSidebar,
  EditServiceSidebar,
} from "./sidebar/AddServiceSidebar";
import { EventsViewSidebar } from "./sidebar/EventsViewSidebar";
import { UpdateResourceSidebar } from "./sidebar/UpdateResourceSidebar";

export type UserActivityState =
  | { type: "view-resource" }
  | { type: "add-service"; start?: string }
  | { type: "edit-data" }
  | {
      type: "view-events";
      date: Date;
      events: ApiDetailedEventWithoutCalendarId[];
    }
  | { type: "edit-service"; event: ApiDetailedEventWithoutCalendarId };

const initialUserActivity: UserActivityState = { type: "view-resource" };

export function ResourceDetail(props: {
  resource: ApiResource;
  labels: ApiLabel[];
  resourceCalendarEvents: ApiDetailedEventWithoutCalendarId[];
  calendarId: string;
  timeRangeProps: TimeRangeProps;
  isTodayAvaliable: boolean;
}) {
  const hasWritePerms = useHasUserRoleCheck(ApiUserRole.BaseResourcesWrite);
  const [userActivity, setUserActivity] =
    useState<UserActivityState>(initialUserActivity);

  const labels = props.labels.sort((a, b) => a.name.localeCompare(b.name));

  const { sidebarFormRef, closeSidebar, handleClose } = useSidebarForm({
    onClose: () => setUserActivity(initialUserActivity),
  });

  return (
    <>
      <Stack gap={2}>
        <Stack spacing={1} alignItems={"flex-end"}>
          <Button
            variant="solid"
            startDecorator={<Add />}
            onClick={() => {
              setUserActivity({ type: "add-service" });
            }}
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
                  onClick={() => setUserActivity({ type: "edit-data" })}
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
            setUserActivity={setUserActivity}
            timeRangeProps={props.timeRangeProps}
            isTodayAvaliable={props.isTodayAvaliable}
          />
        </Stack>
      </Stack>

      <OverlayBoundary>
        <AddServiceSidebar
          open={userActivity.type === "add-service"}
          onClose={closeSidebar}
          start={
            userActivity.type === "add-service" ? userActivity.start : undefined
          }
          resourceId={props.resource.id}
          calendarId={props.calendarId}
        />

        {hasWritePerms && (
          <Sidebar
            open={userActivity.type === "edit-data"}
            onClose={handleClose}
          >
            <UpdateResourceSidebar
              onClose={handleClose}
              onSave={closeSidebar}
              labels={labels}
              resource={props.resource}
              sidebarFormRef={sidebarFormRef}
            />
          </Sidebar>
        )}

        <Sidebar
          open={userActivity.type === "view-events"}
          onClose={closeSidebar}
        >
          {userActivity.type === "view-events" && (
            <SidebarContent
              title={formatDateToFullReadableStringWithShortenedWeekday(
                userActivity.date,
              )}
            >
              <EventsViewSidebar
                events={userActivity.events}
                setUserActivity={setUserActivity}
              />
            </SidebarContent>
          )}
        </Sidebar>

        {userActivity.type === "edit-service" && (
          <EditServiceSidebar
            open
            onClose={closeSidebar}
            onCloseWithConfirmation={handleClose}
            resourceId={props.resource.id}
            calendarId={props.calendarId}
            event={userActivity.event}
          />
        )}
      </OverlayBoundary>
    </>
  );
}
