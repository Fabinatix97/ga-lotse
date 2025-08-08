/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useId, useRef } from "react";

import { useTranslation } from "@/lib/i18n/client";
import { usePublicDepartmentApi } from "@/lib/shared/api/clients";
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
  const departmentApi = usePublicDepartmentApi();
  const { data: departmentInfo } = useSuspenseQuery(
    getDepartmentInfoQuery(departmentApi),
  );
  const titleId = useId();

  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the title when the page is loaded
    titleRef.current?.focus();
  }, []);

  return (
    <PageLayout banner="private">
      <PageContent spacing="lg" spaceContentToSide>
        <section aria-labelledby={titleId}>
          <Typography
            ref={titleRef}
            level="h1"
            mb={3}
            id={titleId}
            tabIndex={-1}
          >
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
