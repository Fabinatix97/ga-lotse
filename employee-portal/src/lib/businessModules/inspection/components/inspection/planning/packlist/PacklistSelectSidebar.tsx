/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInspectionPLDRevision } from "@eshg/employee-portal-api/inspection";
import { InfoOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";

import { useGetAvailablePLDRs } from "@/lib/businessModules/inspection/api/queries/inspection";
import { PacklistSelectSidebarForm } from "@/lib/businessModules/inspection/components/inspection/planning/packlist/PacklistSelectSidebarForm";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface PacklistSidebarProps {
  open: boolean;
  inspectionExternalId: string;
  currentSelectedRevisions: ApiInspectionPLDRevision[];
  onClose: () => void;
}

export function PacklistSelectSidebar(props: Readonly<PacklistSidebarProps>) {
  return (
    <OverlayBoundary>
      <PacklistSelectSidebarWithQueries {...props} />
    </OverlayBoundary>
  );
}

function PacklistSelectSidebarWithQueries({
  open,
  inspectionExternalId,
  currentSelectedRevisions,
  onClose,
}: Readonly<PacklistSidebarProps>) {
  const { data: availablePLDRs } = useGetAvailablePLDRs(inspectionExternalId);

  const pldrsAvailable = availablePLDRs.revisions.length > 0;

  return (
    <Sidebar open={open} onClose={onClose}>
      {pldrsAvailable ? (
        <PacklistSelectSidebarForm
          inspectionExternalId={inspectionExternalId}
          onClose={onClose}
          availablePldrs={availablePLDRs}
          currentSelectedRevisions={currentSelectedRevisions}
        />
      ) : (
        <SidebarContent title="Packliste auswählen">
          <Stack alignItems="center" mt={3}>
            <InfoOutlined sx={{ color: "neutral.500", fontSize: "xl4" }} />
            <Typography aria-label="Hinweis">
              Es sind keine weiteren Packlisten auswählbar.
            </Typography>
          </Stack>
        </SidebarContent>
      )}
    </Sidebar>
  );
}
