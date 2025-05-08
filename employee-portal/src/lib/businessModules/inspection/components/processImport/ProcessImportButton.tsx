/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { Button } from "@mui/joy";

import { ApiUserRole } from "@eshg/base-api";
import { useHasUserRoleCheck } from "@eshg/lib-employee-portal";

import { PotentialDuplicatesFilterProps } from "@/lib/businessModules/inspection/components/facility/pending/PotentialDuplicatesWarning";
import { useProcessImportSidebar } from "@/lib/businessModules/inspection/components/processImport/ProcessImportSidebar";

export function ProcessImportButton({
  onFilterForDuplicates,
}: PotentialDuplicatesFilterProps) {
  const hasImportRole = useHasUserRoleCheck(ApiUserRole.InspectionImport);
  const { open } = useProcessImportSidebar({ onFilterForDuplicates });

  if (!hasImportRole) {
    return null;
  }

  return (
    <Button
      variant="outlined"
      startDecorator={<FileUploadOutlinedIcon />}
      onClick={open}
    >
      Daten Importieren
    </Button>
  );
}
