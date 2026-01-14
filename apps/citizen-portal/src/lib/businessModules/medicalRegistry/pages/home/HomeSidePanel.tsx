/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { useCitizenRoutes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { ScopedInternalLinkButton } from "@/lib/shared/components/scopedLinks";

export function HomeSidePanel() {
  const { t } = useTranslation(["medicalRegistry/overview"]);
  const citizenRoutes = useCitizenRoutes();

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("sidebar.title")}</ContentSheetTitle>
      <Typography>{t("sidebar.content")}</Typography>
      <ScopedInternalLinkButton
        color="primary"
        href={citizenRoutes.professionalRegistrationForm}
      >
        {t("sidebar.registrationForm")}
      </ScopedInternalLinkButton>
    </ContentSheet>
  );
}
