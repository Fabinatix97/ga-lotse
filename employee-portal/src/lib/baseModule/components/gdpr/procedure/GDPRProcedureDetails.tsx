/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiGetGdprProcedureResponse,
  ApiGetReferencePersonResponse,
  ApiUserRole,
} from "@eshg/employee-portal-api/base";
import { Stack } from "@mui/joy";
import { useState } from "react";

import { LinkCentralFilePersonSidebar } from "@/lib/baseModule/components/gdpr/procedure/linkCentralFileSidebar/LinkCentralFilePersonSidebar";
import { CentralFileLinkTile } from "@/lib/baseModule/components/gdpr/procedure/tiles/CentralFileLinkTile";
import { GdprPersonDataTile } from "@/lib/baseModule/components/gdpr/procedure/tiles/GdprPersonDataTile";
import { ProcedureActivityStatusTile } from "@/lib/baseModule/components/gdpr/procedure/tiles/ProcedureActivityStatusTile";
import { ProcedureDetailsTile } from "@/lib/baseModule/components/gdpr/procedure/tiles/ProcedureDetailsTile";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

import { GdprFacilityDataTile } from "./tiles/GdprFacilityDataTile";

interface GDPRProcedureDetailsProps {
  procedure: ApiGetGdprProcedureResponse;
  centralFilePersons: ApiGetReferencePersonResponse[];
}

export function GDPRProcedureDetails({
  procedure,
  centralFilePersons,
}: GDPRProcedureDetailsProps) {
  const hasWritePerms = useHasUserRoleCheck(ApiUserRole.BaseGdprProcedureWrite);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Stack direction={{ xxs: "column", md: "row" }} gap={3}>
        <Stack sx={{ flex: 5, minWidth: "fit-content" }} gap={3}>
          <ProcedureDetailsTile procedure={procedure} />
          <CentralFileLinkTile
            centralFileId={procedure.centralFileId}
            hasMatches={centralFilePersons.length > 0}
            onAddLink={hasWritePerms && (() => setOpen(true))}
          />
        </Stack>
        <Stack sx={{ flex: 20 }} gap={3}>
          {procedure.identificationData.type === "GdprPerson" ? (
            <GdprPersonDataTile identity={procedure.identificationData} />
          ) : (
            <GdprFacilityDataTile identity={procedure.identificationData} />
          )}
          <ProcedureActivityStatusTile />
        </Stack>
      </Stack>

      {hasWritePerms && (
        <OverlayBoundary>
          <LinkCentralFilePersonSidebar
            procedureId={procedure.id}
            procedureVersion={procedure.version}
            centralFilePersons={centralFilePersons}
            open={open}
            onClose={() => setOpen(false)}
          />
        </OverlayBoundary>
      )}
    </>
  );
}
