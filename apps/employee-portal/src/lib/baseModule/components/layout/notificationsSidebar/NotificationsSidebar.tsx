/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InfoOutlined } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";

import { ApiGetAggregatedNotificationsResponse } from "@eshg/base-api";
import {
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";

import { useMarkNotificationsAsRead } from "@/lib/baseModule/api/mutations/notifications";

import { Notification } from "./Notification";

export function useNotificationsSidebar(): UseSidebarResult<NotificationsSidebarProps> {
  return useSidebar({
    component: NotificationsSidebar,
  });
}

interface NotificationsSidebarProps extends DrawerProps {
  notificationResponse: ApiGetAggregatedNotificationsResponse | undefined;
}

function NotificationsSidebar(props: NotificationsSidebarProps) {
  const { mutate: markNotificationsAsRead } = useMarkNotificationsAsRead();
  const notificationIds = props.notificationResponse
    ? props.notificationResponse.notifications.map(
        (notification) => notification.id,
      )
    : [];

  const notificationsCount = props.notificationResponse
    ? props.notificationResponse.notifications.length
    : 0;

  function handleMarkNotificationsAsRead(notificationIds: string[]) {
    markNotificationsAsRead({ notificationIds: notificationIds });
  }

  return (
    <>
      <SidebarContent title="Benachrichtigungen">
        {notificationsCount > 0 && (
          <Stack sx={{ marginTop: 3 }} gap={2}>
            {props.notificationResponse!.notifications.map((notification) => (
              <Notification
                key={notification.id}
                notification={notification}
                resolvedUsers={props.notificationResponse!.resolvedUsers}
              />
            ))}
          </Stack>
        )}
        {notificationsCount === 0 && (
          <Stack gap={3} alignItems="center">
            <InfoOutlined
              sx={{
                marginTop: { xxs: 5, sm: 10 },
                fontSize: { xxs: 80, sm: 128 },
              }}
            />
            <Typography level="h4" component="h2">
              Aktuell nichts Neues
            </Typography>
          </Stack>
        )}
      </SidebarContent>
      <SidebarActions>
        <Button
          disabled={notificationsCount === 0}
          sx={{ alignSelf: "end" }}
          onClick={() => {
            handleMarkNotificationsAsRead(notificationIds);
          }}
        >
          Als gelesen markieren
        </Button>
      </SidebarActions>
    </>
  );
}
