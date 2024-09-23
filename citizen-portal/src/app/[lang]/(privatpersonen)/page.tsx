/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, Typography } from "@mui/joy";

import { PageBanner } from "@/lib/baseModule/components/layout/PageBanner";
import { useTranslation } from "@/lib/i18n/client";
import {
  ServiceCardContainer,
  useMostSearchedCitizenServices,
} from "@/lib/shared/components/card/ServiceCardContainer";

export default function CitizenHomePage() {
  const { t } = useTranslation();
  const mostSearchedCitizenServices = useMostSearchedCitizenServices();
  return (
    <>
      <PageBanner />
      <Box p={4}>
        <Typography component="h2" level="h2" mb={2}>
          {t("private_person.landing_page.header")}
        </Typography>
        <Typography mb={4}>
          {t("private_person.landing_page.subheader")}
        </Typography>
        <Typography mb={4}>
          {t("private_person.landing_page.contact_us")}
        </Typography>
        <ServiceCardContainer navigationItem={mostSearchedCitizenServices} />
      </Box>
    </>
  );
}
