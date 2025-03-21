/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import {
  ApiEmployeeOmsProcedureDetails,
  ApiProcedureStatus,
} from "@eshg/official-medical-service-api";
import { InfoOutlined } from "@mui/icons-material";
import { Alert } from "@mui/joy";
import { isDefined } from "remeda";

import { useConcernSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/ConcernSidebar";
import { useEmailNotificationSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/EmailNotificationSidebar";
import { usePhysicianSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/PhysicianSidebar";
import { DetailsItemInlineEdit } from "@/lib/businessModules/officialMedicalService/shared/DetailsItemInlineEdit";
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
  const emailNotificationSidebar = useEmailNotificationSidebar();

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
        <DetailsItemInlineEdit
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
        <DetailsItemInlineEdit
          renderEditButton={
            !isProcedureFinalized(procedure) && (
              <EditButton
                aria-label="Ärzt:in bearbeiten"
                onClick={() => physicianSidebar.open({ procedure })}
              />
            )
          }
          label="Ärzt:In"
          value={formatPersonName(procedure.physician)}
        />
      )}

      {!!procedure.affectedPerson.emailAddresses?.length && (
        <DetailsItemInlineEdit
          label="E-Mail-Benachrichtigungen"
          value={procedure.sendEmailNotifications ? "Aktiviert" : "Deaktiviert"}
          renderEditButton={
            !isProcedureFinalized(procedure) && (
              <EditButton
                aria-label="E-Mail-Benachrichtigungen bearbeiten"
                onClick={() => emailNotificationSidebar.open({ procedure })}
              />
            )
          }
        />
      )}
    </InfoTile>
  );
}
