/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import { Button, Typography } from "@mui/joy";

import { useRoutes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

export function LandingpageSidePanel() {
  const { t } = useTranslation(["measlesProtection/overview"]);
  const routes = useRoutes();

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("report_a_case.title")}</ContentSheetTitle>
      <Typography>{t("report_a_case.explanation")}</Typography>
      <NavigationLink href={routes.organizationPath.report} passHref>
        <Button fullWidth>{t("report_a_case.to_report_button")}</Button>
      </NavigationLink>
    </ContentSheet>
  );
}
