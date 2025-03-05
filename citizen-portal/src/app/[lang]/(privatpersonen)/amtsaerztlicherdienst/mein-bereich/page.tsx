/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PersonalAreaContent } from "@/lib/businessModules/officialMedicalService/components/personalArea/PersonalAreaContent";
import { PersonalAreaSidePanel } from "@/lib/businessModules/officialMedicalService/components/personalArea/PersonalAreaSidePanel";
import { useTranslation } from "@/lib/i18n/client";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenOmsEntryPage() {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);

  return (
    <PageLayout banner="private">
      <PageContent>
        <PageTitle toolbar={<LogoutButton text={t("common.logoutButton")} />}>
          {t("common.pageTitle")}
        </PageTitle>
        <TwoColumnGrid
          content={<PersonalAreaContent />}
          sidePanel={<PersonalAreaSidePanel />}
        />
      </PageContent>
    </PageLayout>
  );
}
