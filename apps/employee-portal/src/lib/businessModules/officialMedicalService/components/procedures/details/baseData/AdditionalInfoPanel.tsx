/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InfoOutlined } from "@mui/icons-material";
import { Alert } from "@mui/joy";
import { isDefined } from "remeda";

import { DetailsItem, EditButton } from "@eshg/lib-employee-portal";
import { formatDate, formatPersonName } from "@eshg/lib-portal";
import {
  ApiEmployeeOmsProcedureDetails,
  ApiProcedureStatus,
} from "@eshg/official-medical-service-api";

import { useAdditionalInfoSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/AdditionalInfoSidebar";
import { isProcedureFinalized } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function AdditionalInfoPanel({
  procedure,
}: Readonly<{
  procedure: ApiEmployeeOmsProcedureDetails;
}>) {
  const additionalInfoSidebar = useAdditionalInfoSidebar();

  return (
    <InfoTile
      data-testid="additional-info"
      name="additionalInfo"
      title="Zusatzinfos"
      controls={
        !isProcedureFinalized(procedure) && (
          <EditButton
            aria-label="Zusatzinfos bearbeiten"
            onClick={() => additionalInfoSidebar.open({ procedure })}
          />
        )
      }
    >
      {isDefined(procedure.concern) && procedure.concern.highPriority && (
        <Alert
          color="danger"
          startDecorator={<InfoOutlined />}
          data-testid="alert"
        >
          Dringender Fall
        </Alert>
      )}
      {!procedure.concern && procedure.status === ApiProcedureStatus.Draft && (
        <Alert
          color="warning"
          startDecorator={<InfoOutlined />}
          role="note"
          data-testid="alert"
        >
          Um einen Vorgang anzulegen, muss ein Anliegen ergänzt werden.
        </Alert>
      )}
      <DetailsItem label="Anliegen" value={procedure.concern?.nameDe ?? "-"} />
      <DetailsItem
        label="Arzt/Ärztin"
        value={
          procedure.physician ? formatPersonName(procedure.physician) : "-"
        }
      />
      <DetailsItem
        label="Stichtag"
        value={
          procedure.medicalOpinionCutOffDate
            ? formatDate(procedure.medicalOpinionCutOffDate)
            : "-"
        }
      />
      {!!procedure.affectedPerson.emailAddresses?.length && (
        <DetailsItem
          label="E-Mail-Benachrichtigungen"
          value={procedure.sendEmailNotifications ? "Aktiviert" : "Deaktiviert"}
        />
      )}
    </InfoTile>
  );
}
