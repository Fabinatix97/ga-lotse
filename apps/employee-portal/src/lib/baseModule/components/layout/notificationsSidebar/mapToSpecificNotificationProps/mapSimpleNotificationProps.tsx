/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { ApiSimpleNotification } from "@eshg/base-api";

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
