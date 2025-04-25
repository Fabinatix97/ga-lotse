/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";

import { useCitizenRoutes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

export function HomeSidePanel() {
  const { t } = useTranslation(["medicalRegistry/overview"]);
  const citizenRoutes = useCitizenRoutes();

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("sidebar.title")}</ContentSheetTitle>
      <Typography>{t("sidebar.content")}</Typography>
      <InternalLinkButton
        color="primary"
        href={citizenRoutes.professionalRegistrationForm}
      >
        {t("sidebar.registrationForm")}
      </InternalLinkButton>
    </ContentSheet>
  );
}
