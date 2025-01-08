/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetAggregatedNotificationsResponseNotificationsInner,
  ApiUser,
} from "@eshg/employee-portal-api/base";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningIcon from "@mui/icons-material/WarningAmberSharp";
import { Card, Stack, Typography } from "@mui/joy";

import { mapToSpecificNotificationProps } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/mapToSpecificNotificationProps";
import { formatDateTimeRangeToNow } from "@/lib/shared/helpers/dateTime";

export function Notification({
  notification,
  resolvedUsers,
}: {
  notification: ApiGetAggregatedNotificationsResponseNotificationsInner;
  resolvedUsers: Record<string, ApiUser>;
}) {
  const specificNotificationProps = mapToSpecificNotificationProps(
    notification,
    resolvedUsers,
  );
  return (
    <Card variant="soft" data-testid="notification">
      <Stack direction={"row"} alignItems={"center"} gap={1}>
        {specificNotificationProps.severity === "info" && (
          <NotificationsIcon color="neutral" />
        )}
        {specificNotificationProps.severity === "warning" && (
          <WarningIcon color="danger" />
        )}
        <Typography level="h4" component="h2">
          {specificNotificationProps.title}
        </Typography>
      </Stack>
      <Typography level="body-sm">
        {formatDateTimeRangeToNow(notification.createdAt)}
      </Typography>
      {specificNotificationProps.content}
    </Card>
  );
}
