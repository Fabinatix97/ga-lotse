/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import {
  ApiTaskDueAtReminderNotification,
  ApiTaskType,
  ApiUser,
} from "@eshg/base-api";
import { formatDateTime, formatUserName } from "@eshg/lib-portal";

import { ProcedureInternalLink } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/ProcedureInternalLink";
import { SpecificNotificationProps } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/specificNotificationProps";
import { taskTypeNames } from "@/lib/shared/components/procedures/constants";

export function mapTaskDueAtReminderNotificationProps(
  notification: ApiTaskDueAtReminderNotification,
  resolvedUsers: Record<string, ApiUser>,
): SpecificNotificationProps {
  const assignedByUser = resolvedUsers[notification.assignedById]!;
  const title = "Frist Erinnerung";
  const content = (
    <>
      <Typography level="body-md">
        {`Aufgabe „${taskTypeNames[notification.taskType as ApiTaskType]}” ist ${
          notification.dueAt > new Date()
            ? `am ${formatDateTime(notification.dueAt)} fällig`
            : `seit ${formatDateTime(notification.dueAt)} überfällig`
        } (zugewiesen von ${formatUserName(assignedByUser)}).`}
      </Typography>
      <ProcedureInternalLink
        businessModule={notification.businessModule!}
        procedureId={notification.procedureId}
      />
    </>
  );

  return {
    title,
    content,
    severity: "info",
  };
}
