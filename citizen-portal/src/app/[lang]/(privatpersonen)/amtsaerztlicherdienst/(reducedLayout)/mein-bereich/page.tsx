/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetProcedureDetails } from "@/lib/businessModules/officialMedicalService/api/queries/citizenAuthApi";
import { PersonalAreaContent } from "@/lib/businessModules/officialMedicalService/components/personalArea/PersonalAreaContent";
import { PersonalAreaSidePanel } from "@/lib/businessModules/officialMedicalService/components/personalArea/PersonalAreaSidePanel";
import { useTranslation } from "@/lib/i18n/client";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenOmsEntryPage() {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const [{ data: procedure }] = useSuspenseQueries({
    queries: [useGetProcedureDetails()],
  });

  return (
    <PageLayout>
      <PageContent>
        <PageTitle toolbar={<LogoutButton text={t("common.logoutButton")} />}>
          {t("common.pageTitle")}
        </PageTitle>
        <TwoColumnGrid
          content={<PersonalAreaContent procedure={procedure} />}
          sidePanel={<PersonalAreaSidePanel procedure={procedure} />}
        />
      </PageContent>
    </PageLayout>
  );
}
