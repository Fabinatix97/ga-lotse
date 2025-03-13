/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { useHasUserRoleCheck } from "@eshg/lib-employee-portal";
import { FileUploadOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { useImportDataSidebar } from "@/lib/businessModules/medicalRegistry/components/procedures/import/ImportDataSidebar";

export function MedicalRegistryImportButton() {
  const hasImportRole = useHasUserRoleCheck(ApiUserRole.MedicalRegistryImport);
  const { open } = useImportDataSidebar();

  if (!hasImportRole) {
    return null;
  }

  return (
    <Button
      variant="outlined"
      startDecorator={<FileUploadOutlined />}
      onClick={open}
    >
      Daten importieren
    </Button>
  );
}
