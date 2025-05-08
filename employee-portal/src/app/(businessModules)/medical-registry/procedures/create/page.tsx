/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useState } from "react";

import { ApiUserRole } from "@eshg/base-api";
import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";

import { MedicalRegistryCreateProcedureForm } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";
import { MedicalRegistryCreateProcedureSuccessPage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureSuccessPage";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";

export default function MedicalRegistryCreateProcedure() {
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Neuen Eintrag anlegen"
          backButton={<ToolbarBackButton href={routes.procedures.index} />}
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
