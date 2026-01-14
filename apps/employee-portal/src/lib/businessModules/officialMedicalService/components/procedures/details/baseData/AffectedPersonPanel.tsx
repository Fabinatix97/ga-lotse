/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { CopyAll } from "@mui/icons-material";
import { IconButton, Stack, Tooltip } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isDefined } from "remeda";

import {
  CentralFilePersonDetails,
  EditButton,
  SyncBarrier,
  useSyncBarrier,
} from "@eshg/lib-employee-portal";
import { SALUTATION_VALUES } from "@eshg/lib-portal";
import {
  ApiDataOrigin,
  ApiDomesticAddress,
  ApiEmployeeOmsProcedureDetails,
  ApiPostboxAddress,
  ApiProcedureStatus,
} from "@eshg/official-medical-service-api";

import { useUpdateAffectedPersonSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/UpdateAffectedPersonSidebar";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { PersonDetails } from "@/lib/businessModules/schoolEntry/api/models/Person";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { useCopy } from "@/lib/shared/hooks/useCopy";

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
  const copy = useCopy();

  function openSidebar() {
    updateAffectedPersonSidebar.open({
      affectedPerson: person,
      procedureId: procedure.id,
    });
  }

  async function handleClickCopyPersonData() {
    const person = procedure.affectedPerson;
    const personDataText = [];
    const fullName =
      isDefined(person.salutation) && person.salutation !== "NOT_SPECIFIED"
        ? `${SALUTATION_VALUES[person.salutation]} ${person.firstName} ${person.lastName}`
        : `${person.firstName} ${person.lastName}`;
    personDataText.push(fullName);

    const type = person.contactAddress.type;
    switch (type) {
      case "DomesticAddress": {
        const address = person.contactAddress as ApiDomesticAddress;
        personDataText.push(`${address.street} ${address.houseNumber}`);
        if (address.addressAddition) {
          personDataText.push(address.addressAddition);
        }
        personDataText.push(`${address.postalCode} ${address.city}`);
        break;
      }
      case "PostboxAddress": {
        const address = person.contactAddress as ApiPostboxAddress;
        personDataText.push(
          `Postfach ${address.postbox}`,
          `${address.postalCode} ${address.city}`,
        );
        break;
      }
    }

    await copy(
      personDataText.join("\n"),
      "Personendaten in die Zwischenablage kopiert",
    );
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
        <Stack direction="row" gap={2}>
          <Tooltip
            arrow
            title="Kopieren Sie die Adressdaten zum Verfassen eines Briefkopfes"
            variant="outlined"
            placement="bottom"
            describeChild
          >
            <IconButton
              color="primary"
              variant="outlined"
              size="sm"
              aria-label="Adressdaten kopieren"
              onClick={handleClickCopyPersonData}
            >
              <CopyAll />
            </IconButton>
          </Tooltip>
          {procedure.status !== ApiProcedureStatus.Closed &&
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
            )}
        </Stack>
      }
    >
      <CentralFilePersonDetails
        person={person}
        columnSx={COLUMN_STYLE}
        showHumanReadableId={person.dataOrigin !== ApiDataOrigin.External}
      />
    </InfoTile>
  );
}
