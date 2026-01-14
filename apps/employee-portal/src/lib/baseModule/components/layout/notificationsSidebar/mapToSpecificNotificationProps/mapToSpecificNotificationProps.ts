/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetAggregatedNotificationsResponseNotificationsInner,
  ApiUser,
} from "@eshg/base-api";

import { mapFileDeletionApprovalRequestNotificationProps } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/mapFileDeletionApprovalRequestNotificationProps";
import { mapProcedureNotificationProps } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/mapProcedureNotificationProps";
import { mapProgressEntryDeletionApprovalRequestNotificationProps } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/mapProgressEntryDeletionApprovalRequestNotificationProps";
import { mapSimpleNotificationProps } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/mapSimpleNotificationProps";
import { mapTaskDueAtReminderNotificationProps } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/mapTaskDueAtReminderNotificationProps";
import { SpecificNotificationProps } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/specificNotificationProps";

import { mapAbsenceNotificationProps } from "./mapAbsenceNotificationProps";

export function mapToSpecificNotificationProps(
  notification: ApiGetAggregatedNotificationsResponseNotificationsInner,
  resolvedUsers: Record<string, ApiUser>,
): SpecificNotificationProps {
  switch (notification.type) {
    case "FileDeletionApprovalRequestNotification":
      return mapFileDeletionApprovalRequestNotificationProps(
        notification,
        resolvedUsers,
      );
    case "ProgressEntryDeletionApprovalRequestNotification":
      return mapProgressEntryDeletionApprovalRequestNotificationProps(
        notification,
        resolvedUsers,
      );
    case "AbsenceNotification":
      return mapAbsenceNotificationProps(notification, resolvedUsers);
    case "TaskDueAtReminderNotification":
      return mapTaskDueAtReminderNotificationProps(notification, resolvedUsers);
    case "SimpleNotification":
      return mapSimpleNotificationProps(notification);
    case "ProcedureNotification":
      return mapProcedureNotificationProps(notification);
  }
}
