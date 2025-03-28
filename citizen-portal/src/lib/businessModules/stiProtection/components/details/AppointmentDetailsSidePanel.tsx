/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { ApiConcern } from "@eshg/sti-protection-api";
import { Stack } from "@mui/joy";

import { useConcernedCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export function AppointmentDetailsSidePanel({
  concern,
}: {
  concern: ApiConcern;
}) {
  const { t } = useTranslation(["stiProtection/appointmentInfo"]);
  const accessCode = useAccessCodeParam();
  const citizenRoutes = useConcernedCitizenRoutes(concern);

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("personal_area.title")}</ContentSheetTitle>
      <Stack gap={2}>
        <InternalLinkButton
          href={citizenRoutes.appointments.index(accessCode)}
          variant="outlined"
        >
          {t("personal_area.go_to_personal_area")}
        </InternalLinkButton>
      </Stack>
    </ContentSheet>
  );
}
