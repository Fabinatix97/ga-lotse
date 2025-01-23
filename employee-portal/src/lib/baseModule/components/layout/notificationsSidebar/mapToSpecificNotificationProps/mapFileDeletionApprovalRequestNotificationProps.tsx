/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiFileDeletionApprovalRequestNotification,
  ApiUser,
} from "@eshg/base-api";
import { Typography } from "@mui/joy";

import { ProgressEntryInternalLink } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/ProgressEntryInternalLink";
import { SpecificNotificationProps } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/specificNotificationProps";
import { fullName } from "@/lib/shared/components/users/userFormatter";

export function mapFileDeletionApprovalRequestNotificationProps(
  notification: ApiFileDeletionApprovalRequestNotification,
  resolvedUsers: Record<string, ApiUser>,
): SpecificNotificationProps {
  const createdByUser = resolvedUsers[notification.createdBy]!;

  const title = "Löschungsanfrage";
  const content = (
    <>
      <Typography level="body-md">
        {`${fullName(createdByUser)} beantragt die Löschung des Dokuments: ${notification.fileName}`}
      </Typography>
      <ProgressEntryInternalLink
        businessModule={notification.businessModule!}
        procedureId={notification.procedureId}
      />
    </>
  );

  return {
    title,
    content,
    severity: "warning",
  };
}
