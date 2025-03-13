/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Stack, Typography } from "@mui/joy";

import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export function LandingpageSidePanel() {
  const { t } = useTranslation(["officialMedicalService/landing"]);
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("personalArea.title")}</ContentSheetTitle>
      <Typography>{t("personalArea.information")}</Typography>
      <Stack direction="column" gap={2}>
        <InternalLinkButton href={citizenRoutes.appointment}>
          {t("personalArea.bookAppointment")}
        </InternalLinkButton>
        <InternalLinkButton
          variant="outlined"
          href={citizenRoutes.personalArea.index(accessCode)}
        >
          {t("personalArea.goToPersonalArea")}
        </InternalLinkButton>
      </Stack>
    </ContentSheet>
  );
}
