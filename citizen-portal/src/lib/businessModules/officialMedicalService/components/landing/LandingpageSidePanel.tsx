/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

export function LandingpageSidePanel() {
  const { t } = useTranslation(["officialMedicalService/landing"]);

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("personalArea.title")}</ContentSheetTitle>
      <Typography>{t("personalArea.information")}</Typography>
      <Stack direction="column" gap={2}>
        <Button type="submit" variant="outlined">
          {t("personalArea.goToPersonalArea")}
        </Button>
      </Stack>
    </ContentSheet>
  );
}
