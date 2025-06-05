/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { SxProps } from "@mui/joy/styles/types";

import {
  CentralFilePersonDetails,
  EditButton,
  SyncBarrier,
  useSyncBarrier,
} from "@eshg/lib-employee-portal";
import {
  ApiAffectedPersonSync,
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
  ApiProcedureStatus,
} from "@eshg/measles-protection-api";

import { useEditAffectedPersonSidebar } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/EditAffectedPersonSidebar";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100%/3 - 2 * ${theme.spacing(2)})` }),
};

export function AffectedPerson({
  procedure,
}: Readonly<{
  procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure;
}>) {
  const title = "Betroffene Person";
  const person = procedure.affectedPerson;
  const personSync = person.affectedPersonSync;
  const editAffectedPersonSidebar = useEditAffectedPersonSidebar();

  function openEditAffectedPersonSidebar() {
    editAffectedPersonSidebar.open({
      procedureId: procedure.id,
      person: person,
    });
  }

  function procedureOpen() {
    return (
      procedure.procedureStatus === ApiProcedureStatus.Draft ||
      procedure.procedureStatus === ApiProcedureStatus.Open ||
      procedure.procedureStatus === ApiProcedureStatus.InProgress
    );
  }

  const syncRoute =
    procedure.procedureStatus === ApiProcedureStatus.Draft
      ? routes.procedures
          .draft(procedure.id)
          .syncAffectedPerson(
            personSync?.fileStateId ?? "",
            personSync?.version ?? 0,
          )
      : routes.procedures
          .details(procedure.id)
          .syncAffectedPerson(
            personSync?.fileStateId ?? "",
            personSync?.version ?? 0,
          );
  const affectedPersonSync: ApiAffectedPersonSync = {
    fileStateId: personSync?.fileStateId ?? "",
    version: personSync?.version ?? 0,
    outdated: personSync?.outdated ?? false,
  };
  const { syncBarrier } = useSyncBarrier(syncRoute, affectedPersonSync);

  return (
    <InfoTile
      title={title}
      name="affectedPerson"
      controls={
        procedureOpen() && (
          <SyncBarrier
            outdated={personSync?.outdated ?? false}
            syncHref={syncRoute}
          >
            <EditButton
              aria-label="Betroffene Person bearbeiten"
              onClick={syncBarrier(openEditAffectedPersonSidebar)}
            />
          </SyncBarrier>
        )
      }
    >
      <CentralFilePersonDetails
        person={{
          ...person,
          contactAddress: person.address,
        }}
        columnSx={COLUMN_STYLE}
      />
    </InfoTile>
  );
}
