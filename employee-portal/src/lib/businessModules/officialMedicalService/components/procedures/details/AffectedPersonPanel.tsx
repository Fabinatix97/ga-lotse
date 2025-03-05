/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiEmployeeOmsProcedureDetails,
  ApiProcedureStatus,
} from "@eshg/official-medical-service-api";
import { SxProps } from "@mui/joy/styles/types";

import { useUpdateAffectedPersonSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/UpdateAffectedPersonSidebar";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { PersonDetails } from "@/lib/businessModules/schoolEntry/api/models/Person";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { CentralFilePersonDetails } from "@/lib/shared/components/centralFile/display/CentralFilePersonDetails";
import {
  SyncBarrier,
  useSyncBarrier,
} from "@/lib/shared/components/centralFile/sync/SyncBarrier";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100%/3 - 2 * ${theme.spacing(2)})` }),
};

export function AffectedPersonPanel({
  procedure,
}: Readonly<{
  procedure: ApiEmployeeOmsProcedureDetails;
}>) {
  const person = procedure.affectedPerson;

  const updateAffectedPersonSidebar = useUpdateAffectedPersonSidebar();

  function openSidebar() {
    updateAffectedPersonSidebar.open({
      affectedPerson: person,
      procedureId: procedure.id,
    });
  }

  const syncRoute =
    person.affectedPersonSync !== undefined
      ? routes.procedures
          .byId(procedure.id)
          .syncAffectedPerson(
            person.affectedPersonSync.fileStateId,
            person.affectedPersonSync.version,
          )
      : "";

  const syncPersonParams = {
    fileStateId: person.affectedPersonSync!.fileStateId,
    outdated: person.affectedPersonSync!.outdated,
    ...person,
  };
  const { syncBarrier } = useSyncBarrier(
    syncRoute,
    syncPersonParams as PersonDetails,
  );

  if (!person) {
    return null;
  }

  return (
    <InfoTile
      data-testid="affected-person"
      name="affectedPerson"
      title="Betroffene Person"
      controls={
        procedure.status !== ApiProcedureStatus.Closed &&
        person.dataOrigin !== "EXTERNAL" &&
        person.affectedPersonSync !== undefined && (
          <SyncBarrier
            outdated={person.affectedPersonSync.outdated}
            syncHref={syncRoute}
          >
            <EditButton
              aria-label="Person bearbeiten"
              onClick={syncBarrier(openSidebar)}
            />
          </SyncBarrier>
        )
      }
    >
      <CentralFilePersonDetails person={person} columnSx={COLUMN_STYLE} />
    </InfoTile>
  );
}
