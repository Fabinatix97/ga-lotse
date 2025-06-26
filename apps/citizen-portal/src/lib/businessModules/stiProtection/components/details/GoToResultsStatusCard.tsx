/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { useCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { ScopedInternalLinkButton } from "@/lib/shared/components/scopedLinks";

interface GoToResultsStatusCardProps {
  variant?: "landing" | "my-area";
}
export function GoToResultsStatusCard({
  variant = "my-area",
}: GoToResultsStatusCardProps) {
  const { t } = useTranslation("stiProtection/resultsStatus");
  const citizenRoutes = useCitizenRoutes();
  const forMyArea = variant === "my-area";
  const baseKey = forMyArea
    ? "go_to_card"
    : "landing.login_and_view_status_card";

  return (
    <ContentSheet sx={{ gridArea: "sidebar" }}>
      <ContentSheetTitle>{t(`${baseKey}.title`)}</ContentSheetTitle>
      <Typography>{t(`${baseKey}.body`)}</Typography>
      <ScopedInternalLinkButton
        variant={forMyArea ? "outlined" : "solid"}
        href={citizenRoutes.personalArea.resultsStatus}
      >
        {t(`${baseKey}.link_label`)}
      </ScopedInternalLinkButton>
    </ContentSheet>
  );
}
