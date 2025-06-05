/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";

import { InternalLinkButton } from "@eshg/lib-portal";
import { ApiConcern } from "@eshg/sti-protection-api";

import { useConcernedCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export function LandingpageSidePanel({ concern }: { concern: ApiConcern }) {
  const { t } = useTranslation(["stiProtection/overview"]);
  const accessCode = useAccessCodeParam();
  const citizenRoutes = useConcernedCitizenRoutes(concern);

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("personal_area.title")}</ContentSheetTitle>
      <Typography>{t("personal_area.information")}</Typography>
      <Stack gap={2}>
        <InternalLinkButton href={citizenRoutes.concernPath.bookAppointment}>
          {t("personal_area.create_appointment")}
        </InternalLinkButton>
        <InternalLinkButton
          href={citizenRoutes.personalArea.index(accessCode)}
          variant="outlined"
        >
          {t("personal_area.go_to_personal_area")}
        </InternalLinkButton>
      </Stack>
    </ContentSheet>
  );
}
