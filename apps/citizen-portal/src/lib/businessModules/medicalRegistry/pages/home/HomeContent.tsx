/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

export function HomeContent() {
  const { t } = useTranslation(["medicalRegistry/overview"]);

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("content.title")}</ContentSheetTitle>
        <Typography>{t("content.information")}</Typography>
        <Typography>{t("content.requiredFieldsHint")}</Typography>
      </ContentSheet>
    </GridColumnStack>
  );
}
