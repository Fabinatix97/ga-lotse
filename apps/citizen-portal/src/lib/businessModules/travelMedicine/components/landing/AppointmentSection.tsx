/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { ScopedInternalLinkButton } from "@/lib/shared/components/scopedLinks";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export function AppointmentSection() {
  const { t } = useTranslation(["travelMedicine/landing"]);
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("personalArea.title")}</ContentSheetTitle>
      <Typography>{t("personalArea.information")}</Typography>
      <Stack direction="column" gap={2}>
        <ScopedInternalLinkButton href={citizenRoutes.appointment}>
          {t("personalArea.bookAppointment")}
        </ScopedInternalLinkButton>
        <ScopedInternalLinkButton
          href={citizenRoutes.viewAppointment.index(accessCode)}
          variant="outlined"
        >
          {t("personalArea.goToPersonalArea")}
        </ScopedInternalLinkButton>
      </Stack>
    </ContentSheet>
  );
}
