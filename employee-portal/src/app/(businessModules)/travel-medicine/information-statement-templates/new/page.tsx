/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiTravelMedicineFeature } from "@eshg/employee-portal-api/travelMedicine";

import { InformationStatementTemplateForm } from "@/lib/businessModules/travelMedicine/components/templates/informationStatement/InformationStatementTemplateForm";
import { ToggledPage } from "@/lib/businessModules/travelMedicine/shared/ToggledPage";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function NewInformationStatementTemplatePage() {
  return (
    <ToggledPage
      feature={ApiTravelMedicineFeature.CitizenPortalInformationStatement}
    >
      <StickyToolbarLayout
        toolbar={
          <Toolbar
            title="Aufklärungsbogenvorlage erstellen"
            backHref={routes.informationStatementTemplates.index}
          />
        }
      >
        <MainContentLayout fullViewportHeight>
          <InformationStatementTemplateForm templateId={""} />
        </MainContentLayout>
      </StickyToolbarLayout>
    </ToggledPage>
  );
}
