/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiEmployeeOmsProcedureDetails,
  ApiProcedureStatus,
} from "@eshg/employee-portal-api/officialMedicalService";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { InfoOutlined } from "@mui/icons-material";
import { Alert } from "@mui/joy";
import { isDefined } from "remeda";

import { useConcernSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/ConcernSidebar";
import { usePhysicianSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/PhysicianSidebar";
import { DetailsCellInlineEdit } from "@/lib/businessModules/officialMedicalService/shared/DetailsCellInlineEdit";
import { isProcedureFinalized } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

export function AdditionalInfoPanel({
  procedure,
}: Readonly<{
  procedure: ApiEmployeeOmsProcedureDetails;
}>) {
  const concernSidebar = useConcernSidebar();
  const physicianSidebar = usePhysicianSidebar();

  return (
    <InfoTile
      data-testid="additional-info"
      name="additionalInfo"
      title="Zusatzinfos"
      footer={
        <>
          {!procedure.concern &&
            procedure.status === ApiProcedureStatus.Draft && (
              <InfoTileAddButton
                onClick={() => concernSidebar.open({ procedure })}
              >
                Anliegen hinzufügen
              </InfoTileAddButton>
            )}
          {!isProcedureFinalized(procedure) && !procedure.physician && (
            <InfoTileAddButton
              onClick={() =>
                physicianSidebar.open({
                  procedure: procedure,
                })
              }
            >
              Ärzt:in hinzufügen
            </InfoTileAddButton>
          )}
        </>
      }
    >
      {isDefined(procedure.concern) && procedure.concern.highPriority && (
        <Alert color="danger" startDecorator={<InfoOutlined />}>
          Dringender Fall
        </Alert>
      )}
      {!procedure.concern && procedure.status === ApiProcedureStatus.Draft && (
        <Alert color="warning" startDecorator={<InfoOutlined />}>
          Um einen Vorgang anzulegen, muss ein Anliegen ergänzt werden.
        </Alert>
      )}
      {procedure.concern && (
        <DetailsCellInlineEdit
          name="concern"
          label="Anliegen"
          value={procedure.concern.nameDe}
          renderEditButton={
            procedure.status === ApiProcedureStatus.Draft && (
              <EditButton
                aria-label="Anliegen bearbeiten"
                onClick={() => concernSidebar.open({ procedure })}
              />
            )
          }
        />
      )}

      {procedure.physician && (
        <DetailsCellInlineEdit
          renderEditButton={
            !isProcedureFinalized(procedure) && (
              <EditButton
                aria-label="Ärzt:in bearbeiten"
                onClick={() => physicianSidebar.open({ procedure })}
              />
            )
          }
          name="physician"
          label="Ärzt:In"
          value={formatPersonName(procedure.physician)}
        />
      )}
    </InfoTile>
  );
}
