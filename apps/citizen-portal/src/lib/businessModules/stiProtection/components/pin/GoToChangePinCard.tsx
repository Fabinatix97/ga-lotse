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

export function GoToChangePinCard() {
  const { t } = useTranslation("stiProtection/pin");
  const citizenRoutes = useCitizenRoutes();

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("go_to_card.title")}</ContentSheetTitle>
      <Typography>{t("go_to_card.body")}</Typography>
      <ScopedInternalLinkButton
        variant="outlined"
        href={citizenRoutes.personalArea.pin}
      >
        {t("go_to_card.link_label")}
      </ScopedInternalLinkButton>
    </ContentSheet>
  );
}
