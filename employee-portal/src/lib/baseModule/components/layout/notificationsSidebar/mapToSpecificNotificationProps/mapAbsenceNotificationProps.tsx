/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAbsenceNotification, ApiUser } from "@eshg/base-api";
import { Typography } from "@mui/joy";

import { UserLink } from "@/lib/shared/components/users/UserLink";
import { formatDateRange } from "@/lib/shared/helpers/dateTime";

import { SpecificNotificationProps } from "./specificNotificationProps";

export function mapAbsenceNotificationProps(
  notification: ApiAbsenceNotification,
  resolvedUsers: Record<string, ApiUser>,
): SpecificNotificationProps {
  const title = "Abwesenheit";
  const absentUser = resolvedUsers[notification.absentUserId]!;

  const content = (
    <>
      <Typography level="body-md">
        {<UserLink user={absentUser} />} hat eine Abwesenheit eingetragen:
        <br />
        <strong>{`${formatDateRange(notification.absenceStart, notification.absenceEnd)}.`}</strong>
      </Typography>
    </>
  );

  return {
    title,
    content,
    severity: "info",
  };
}
