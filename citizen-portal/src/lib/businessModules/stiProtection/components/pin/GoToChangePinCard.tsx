/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";

import { useCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

export function GoToChangePinCard() {
  const { t } = useTranslation("stiProtection/pin");
  const citizenRoutes = useCitizenRoutes();

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("go_to_card.title")}</ContentSheetTitle>
      <Typography>{t("go_to_card.body")}</Typography>
      <InternalLinkButton
        variant="outlined"
        href={citizenRoutes.personalArea.pin}
      >
        {t("go_to_card.link_label")}
      </InternalLinkButton>
    </ContentSheet>
  );
}
