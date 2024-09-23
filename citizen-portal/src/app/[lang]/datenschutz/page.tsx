/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";
import { TitleAndSheetContentLayout } from "@/lib/shared/components/layout/TitleAndSheetContentLayout";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation("privacyPolicy");
  return (
    <TitleAndSheetContentLayout pageTitle={t("pageTitle.privacy_policy")}>
      <Typography>{t("page_under_construction")}</Typography>
    </TitleAndSheetContentLayout>
  );
}
