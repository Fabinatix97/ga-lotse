/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiSimpleNotification } from "@eshg/employee-portal-api/base";
import { Typography } from "@mui/joy";

import { SpecificNotificationProps } from "./specificNotificationProps";

export function mapSimpleNotificationProps(
  notification: ApiSimpleNotification,
): SpecificNotificationProps {
  const title = notification.title;
  const content = (
    <Typography level="body-md">{notification.message}</Typography>
  );

  return {
    title,
    content,
    severity: "info",
  };
}
