/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SxProps } from "@mui/joy/styles/types";

import {
  CentralFilePersonDetails,
  EditButton,
  SyncBarrier,
  useSyncBarrier,
} from "@eshg/lib-employee-portal";
import {
  ApiCustodian,
  ApiCustodianSync,
  ApiCustodianWithoutDateOfBirth,
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
  ApiProcedureStatus,
} from "@eshg/measles-protection-api";

import { useEditCustodianSidebar } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/EditCustodianSidebar";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100%/3 - 2 * ${theme.spacing(2)})` }),
};

function InfoTileWithSyncBarrier({
  custodianSync,
  syncRoute,
  openEditCustodianSidebar,
}: Readonly<{
  custodianSync: ApiCustodianSync;
  syncRoute: string;
  openEditCustodianSidebar: () => void;
}>) {
  const { syncBarrier } = useSyncBarrier(syncRoute, custodianSync);

  return (
    <SyncBarrier
      outdated={custodianSync?.outdated ?? false}
      syncHref={syncRoute}
    >
      <EditButton
        aria-label="PSB bearbeiten"
        onClick={syncBarrier(openEditCustodianSidebar)}
      />
    </SyncBarrier>
  );
}

export function Custodian({
  custodian,
  procedure,
}: Readonly<{
  custodian: ApiCustodian | ApiCustodianWithoutDateOfBirth;
  procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure;
}>) {
  const editCustodianSidebar = useEditCustodianSidebar();

  function openEditCustodianSidebar() {
    editCustodianSidebar.open({
      procedureId: procedure.id,
      custodianId: custodian.custodianId,
      custodian: custodian,
    });
  }

  function procedureOpen() {
    return (
      procedure.procedureStatus === ApiProcedureStatus.Draft ||
      procedure.procedureStatus === ApiProcedureStatus.Open ||
      procedure.procedureStatus === ApiProcedureStatus.InProgress
    );
  }

  function getSyncRoute(
    procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure,
    custodian: ApiCustodian | ApiCustodianWithoutDateOfBirth,
  ) {
    if ("dateOfBirth" in custodian) {
      return procedure.procedureStatus === ApiProcedureStatus.Draft
        ? routes.procedures
            .draft(procedure.id)
            .syncCustodian(
              custodian.custodianId,
              custodian.custodianSync?.fileStateId ?? "",
              custodian.custodianSync?.version ?? 0,
            )
        : routes.procedures
            .details(procedure.id)
            .syncCustodian(
              custodian.custodianId,
              custodian.custodianSync?.fileStateId ?? "",
              custodian.custodianSync?.version ?? 0,
            );
    } else {
      return undefined;
    }
  }

  function getCustodianSync(
    custodian: ApiCustodian | ApiCustodianWithoutDateOfBirth,
  ) {
    if ("dateOfBirth" in custodian) {
      return {
        fileStateId: custodian.custodianSync?.fileStateId ?? "",
        version: custodian.custodianSync?.version ?? 0,
        outdated: custodian.custodianSync?.outdated ?? false,
      };
    } else {
      return undefined;
    }
  }

  const syncRoute: string | undefined = getSyncRoute(procedure, custodian);

  const custodianSync: ApiCustodianSync | undefined =
    getCustodianSync(custodian);

  return (
    <InfoTile
      title="PSB - Personensorgeberechtigte:r"
      name="custodian"
      controls={
        procedureOpen() &&
        (syncRoute === undefined || custodianSync === undefined ? (
          <EditButton
            aria-label="PSB bearbeiten"
            onClick={openEditCustodianSidebar}
          />
        ) : (
          <InfoTileWithSyncBarrier
            custodianSync={custodianSync}
            syncRoute={syncRoute}
            openEditCustodianSidebar={openEditCustodianSidebar}
          />
        ))
      }
    >
      <CentralFilePersonDetails
        person={{
          ...custodian,
          contactAddress: custodian.address,
        }}
        columnSx={COLUMN_STYLE}
      />
    </InfoTile>
  );
}
