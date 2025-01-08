/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useId } from "react";

import { useTranslation } from "@/lib/i18n/client";
import { useDepartmentApi } from "@/lib/shared/api/clients";
import { getDepartmentInfoQuery } from "@/lib/shared/api/queries/department";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function OrganizationHomePage() {
  const { t } = useTranslation();
  const departmentApi = useDepartmentApi();
  const { data: departmentInfo } = useSuspenseQuery(
    getDepartmentInfoQuery(departmentApi),
  );
  const titleId = useId();

  return (
    <PageLayout banner="business">
      <PageContent spacing="lg" spaceContentToSide>
        <section aria-labelledby={titleId}>
          <Typography level="h1" mb={3} id={titleId}>
            {t("organization.landing_page.header")}
          </Typography>
          <Typography>
            {t("organization.landing_page.subheader", {
              name: departmentInfo.name,
            })}
          </Typography>
        </section>
      </PageContent>
    </PageLayout>
  );
}
