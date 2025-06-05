/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { ApiProcedureNotification } from "@eshg/base-api";

import { ProcedureInternalLink } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/ProcedureInternalLink";
import { SpecificNotificationProps } from "@/lib/baseModule/components/layout/notificationsSidebar/mapToSpecificNotificationProps/specificNotificationProps";

export function mapProcedureNotificationProps(
  notification: ApiProcedureNotification,
): SpecificNotificationProps {
  const title = notification.title;
  const content = (
    <>
      <Typography level="body-md">{notification.message}</Typography>
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
