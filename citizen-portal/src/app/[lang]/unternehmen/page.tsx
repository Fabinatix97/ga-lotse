/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, Typography } from "@mui/joy";

import { PageBanner } from "@/lib/baseModule/components/layout/PageBanner";
import { useTranslation } from "@/lib/i18n/client";

export default function OrganizationHomePage() {
  const { t } = useTranslation();

  return (
    <>
      <PageBanner />
      <Box p={4}>
        <Typography component="h2" level="h2" mb={2}>
          {t("organization.landing_page.header")}
        </Typography>
        <Typography mb={4}>
          {t("organization.landing_page.subheader")}
        </Typography>
        <Typography mb={4}>
          {t("organization.landing_page.contact_us")}
        </Typography>
      </Box>
    </>
  );
}
