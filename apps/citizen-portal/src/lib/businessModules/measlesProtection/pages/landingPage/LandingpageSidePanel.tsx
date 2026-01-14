/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { useRoutes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { ScopedInternalLinkButton } from "@/lib/shared/components/scopedLinks";

export function LandingpageSidePanel() {
  const { t } = useTranslation(["measlesProtection/overview"]);
  const routes = useRoutes();

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("report_a_case.title")}</ContentSheetTitle>
      <Typography>{t("report_a_case.explanation")}</Typography>
      <ScopedInternalLinkButton href={routes.organizationPath.report} fullWidth>
        {t("report_a_case.to_report_button")}
      </ScopedInternalLinkButton>
    </ContentSheet>
  );
}
