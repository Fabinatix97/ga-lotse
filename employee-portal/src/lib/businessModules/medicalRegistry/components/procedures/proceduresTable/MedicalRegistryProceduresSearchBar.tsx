/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Row } from "@eshg/lib-portal/components/Row";
import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { MedicalRegistryImportButton } from "@/lib/businessModules/medicalRegistry/components/procedures/import/MedicalRegistryImportButton";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";

export function MedicalRegistryProceduresSearchBar() {
  return (
    <Row justifyContent="flex-end">
      <MedicalRegistryImportButton />
      <NavigationLink href={routes.procedures.create} passHref>
        <Button startDecorator={<Add />}>Eintrag erstellen</Button>
      </NavigationLink>
    </Row>
  );
}
