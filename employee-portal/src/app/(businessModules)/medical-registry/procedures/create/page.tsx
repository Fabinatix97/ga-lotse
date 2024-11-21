/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { useState } from "react";

import { MedicalRegistryCreateProcedureForm } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";
import { MedicalRegistryCreateProcedureSuccessPage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureSuccessPage";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function MedicalRegistryCreateProcedure() {
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={"Neuen Eintrag anlegen"}
          backHref={routes.procedures.index}
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <RestrictedPage requiredUserRole={ApiUserRole.MedicalRegistryAdmin}>
          {!showSuccessPage ? (
            <MedicalRegistryCreateProcedureForm
              setShowSuccessPage={setShowSuccessPage}
            />
          ) : (
            <MedicalRegistryCreateProcedureSuccessPage
              onButtonClick={() => setShowSuccessPage(false)}
            />
          )}
        </RestrictedPage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
