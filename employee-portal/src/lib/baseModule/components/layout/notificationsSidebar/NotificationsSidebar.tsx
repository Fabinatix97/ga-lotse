/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetAggregatedNotificationsResponse } from "@eshg/employee-portal-api/base";
import { InfoOutlined } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { isNonNullish } from "remeda";

import { useMarkNotificationsAsRead } from "@/lib/baseModule/api/mutations/notifications";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

import { Notification } from "./Notification";

interface NotificationsSidebarProps {
  open: boolean;
  onClose: () => void;
  notificationResponse: ApiGetAggregatedNotificationsResponse | undefined;
}

export function NotificationsSidebar(props: NotificationsSidebarProps) {
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
    <Sidebar open={props.open} onClose={props.onClose} zIndex={"headerSidebar"}>
      <SidebarContent title="Benachrichtigungen">
        {isNonNullish(props.notificationResponse) && (
          <Stack sx={{ marginTop: 3 }} gap={2}>
            {props.notificationResponse.notifications.map((notification) => (
              <Notification
                key={notification.id}
                notification={notification}
                resolvedUsers={props.notificationResponse!.resolvedUsers}
              />
            ))}
          </Stack>
        )}
        {props.notificationResponse === null ||
          (notificationsCount === 0 && (
            <Stack gap={3} alignItems={"center"}>
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
          ))}
      </SidebarContent>
      {isNonNullish(props.notificationResponse) && (
        <SidebarActions>
          <Button
            disabled={notificationsCount === 0}
            onClick={() => {
              handleMarkNotificationsAsRead(notificationIds);
            }}
            sx={{ alignSelf: "end" }}
          >
            Als gelesen markieren
          </Button>
        </SidebarActions>
      )}
    </Sidebar>
  );
}
