/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { isPast } from "date-fns";

import { useControlledAlert } from "@eshg/lib-portal/errorHandling/AlertContext";
import {
  ApiBusinessModule,
  ApiGetGdprNotificationBannerResponse,
} from "@eshg/lib-procedures-api";

import { formatDurationFromNowUntil } from "../../../utils/formatters";
import { gdprRoutes } from "../config/gdprRoutes";

export function useGdprValidationTasksAlert({
  banner,
  businessModule,
}: {
  banner: ApiGetGdprNotificationBannerResponse | undefined;
  businessModule: ApiBusinessModule;
}) {
  let numberOfTasksLine = "";
  let deadlineLine = "";

  if (banner) {
    const { openValidationTasksCount, earliestDueDate } = banner;
    numberOfTasksLine =
      openValidationTasksCount === 1
        ? `Es liegt eine DSGVO-Anfrage vor.`
        : `Es liegen ${openValidationTasksCount} DSGVO-Anfragen vor.`;
    deadlineLine =
      earliestDueDate === undefined || isPast(earliestDueDate)
        ? "Sie müssen diese sofort bearbeiten."
        : `Sie haben noch ${formatDurationFromNowUntil(earliestDueDate)} Zeit, diese zu bearbeiten.`;
  }

  useControlledAlert({
    type: "warning",
    open: !!banner && banner.openValidationTasksCount > 0,
    message: `${numberOfTasksLine} ${deadlineLine}`,
    action: {
      text: "Anfragen Prüfen",
      href: gdprRoutes.validationTasks(businessModule).overview,
    },
  });
}
