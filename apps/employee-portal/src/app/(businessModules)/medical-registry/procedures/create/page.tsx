/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import {
  MainContentLayout,
  RestrictedPage,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";

import { MedicalRegistryCreateProcedureForm } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";

export default function MedicalRegistryCreateProcedure() {
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
          <MedicalRegistryCreateProcedureForm />
        </RestrictedPage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
