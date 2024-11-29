/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  ApiBusinessModule,
  ApiGetGdprNotificationBannerResponse,
} from "@eshg/employee-portal-api/businessProcedures";
import { useControlledAlert } from "@eshg/lib-portal/errorHandling/AlertContext";
import { isPast } from "date-fns";

import { routes } from "@/lib/baseModule/shared/routes";
import { formatDurationFromNowUntil } from "@/lib/shared/helpers/dateTime";

export function useGdprValidationTasksAlert({
  banner,
  businessModule,
}: {
  banner: ApiGetGdprNotificationBannerResponse;
  businessModule: ApiBusinessModule;
}) {
  const { openValidationTasksCount, earliestDueDate } = banner;

  const numberOfTasksLine =
    openValidationTasksCount === 1
      ? `Es liegt eine DSGVO-Anfrage vor.`
      : `Es liegen ${openValidationTasksCount} DSGVO-Anfragen vor.`;
  const deadlineLine =
    earliestDueDate === undefined || isPast(earliestDueDate)
      ? "Sie müssen diese sofort bearbeiten."
      : `Sie haben noch ${formatDurationFromNowUntil(earliestDueDate)} Zeit, diese zu bearbeiten.`;

  useControlledAlert({
    type: "warning",
    open: openValidationTasksCount > 0,
    message: `${numberOfTasksLine} ${deadlineLine}`,
    action: {
      text: "Anfragen Prüfen",
      href: routes.gdpr.validationTasks(businessModule).overview,
    },
  });
}
