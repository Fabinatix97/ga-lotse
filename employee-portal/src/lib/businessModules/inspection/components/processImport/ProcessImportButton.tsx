/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiInspectionFeature } from "@eshg/employee-portal-api/inspection";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { Button } from "@mui/joy";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
import { PotentialDuplicatesFilterProps } from "@/lib/businessModules/inspection/components/facility/pending/PotentialDuplicatesWarning";
import { useProcessImportSidebar } from "@/lib/businessModules/inspection/components/processImport/ProcessImportSidebar";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

export function ProcessImportButton({
  onFilterForDuplicates,
}: PotentialDuplicatesFilterProps) {
  const isEnabled = useIsNewFeatureEnabled(ApiInspectionFeature.Import);
  const hasImportRole = useHasUserRoleCheck(ApiUserRole.InspectionImport);
  const { open } = useProcessImportSidebar({ onFilterForDuplicates });

  if (!isEnabled || !hasImportRole) {
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
