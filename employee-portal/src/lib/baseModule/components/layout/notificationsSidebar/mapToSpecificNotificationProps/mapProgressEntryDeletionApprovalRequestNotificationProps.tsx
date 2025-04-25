/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import {
  ApiManualProgressEntryType,
  ApiProgressEntryDeletionApprovalRequestNotification,
  ApiUser,
} from "@eshg/base-api";
import { formatUserName } from "@eshg/lib-portal/formatters/person";

import { ProgressEntryInternalLink } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/ProgressEntryInternalLink";
import { SpecificNotificationProps } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/specificNotificationProps";
import { manualProgressEntryTypeNames } from "@/lib/shared/components/procedures/progress-entries/constants";

export function mapProgressEntryDeletionApprovalRequestNotificationProps(
  notification: ApiProgressEntryDeletionApprovalRequestNotification,
  resolvedUsers: Record<string, ApiUser>,
): SpecificNotificationProps {
  const createdByUser = resolvedUsers[notification.createdBy]!;

  const title = "Löschungsanfrage";
  const content = (
    <>
      <Typography level="body-md">
        {`${formatUserName(createdByUser)} beantragt die Löschung eines Verlaufsantrags: ${manualProgressEntryTypeNames[notification.manualProgressEntryType as ApiManualProgressEntryType]}`}
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
