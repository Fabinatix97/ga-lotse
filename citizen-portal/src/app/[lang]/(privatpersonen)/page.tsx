/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTranslation } from "@/lib/i18n/client";
import { useDepartmentApi } from "@/lib/shared/api/clients";
import { getDepartmentInfoQuery } from "@/lib/shared/api/queries/department";
import {
  ServiceCardContainer,
  useMostSearchedCitizenServices,
} from "@/lib/shared/components/card/ServiceCardContainer";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function CitizenHomePage() {
  const { t } = useTranslation();
  const mostSearchedCitizenServices = useMostSearchedCitizenServices();
  const departmentApi = useDepartmentApi();
  const { data: departmentInfo } = useSuspenseQuery(
    getDepartmentInfoQuery(departmentApi),
  );

  return (
    <PageLayout banner="private">
      <PageContent spacing="lg" spaceContentToSide>
        <section>
          <Typography component="h2" level="h2" mb={3}>
            {t("private_person.landing_page.header")}
          </Typography>
          <Typography>
            {t("private_person.landing_page.subheader", {
              name: departmentInfo.name,
            })}
          </Typography>
        </section>
        <ServiceCardContainer navigationItem={mostSearchedCitizenServices} />
      </PageContent>
    </PageLayout>
  );
}
