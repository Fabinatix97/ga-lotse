/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { Button } from "@mui/joy";

import { PotentialDuplicatesFilterProps } from "@/lib/businessModules/inspection/components/facility/pending/PotentialDuplicatesWarning";
import { useProcessImportSidebar } from "@/lib/businessModules/inspection/components/processImport/ProcessImportSidebar";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

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
      onClick={open}
      variant="outlined"
      startDecorator={<FileUploadOutlinedIcon />}
    >
      Daten Importieren
    </Button>
  );
}
