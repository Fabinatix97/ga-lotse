/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useState } from "react";
import { isNonNullish, isNullish } from "remeda";

import { ApiInspection, ApiInspectionAppointment } from "@eshg/inspection-api";
import { DetailsItem } from "@eshg/lib-employee-portal";
import { Alert, DetailsList } from "@eshg/lib-portal";

import { AppointmentSidebar } from "@/lib/businessModules/inspection/components/inspection/common/appointment/AppointmentSidebar";
import { getFormattedAppointmentParts } from "@/lib/businessModules/inspection/components/inspection/common/appointment/appointmentUtils";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

interface AppointmentTileProps {
  readonly?: boolean;
  inspection: ApiInspection;
  appointment?: ApiInspectionAppointment;
}

export function AppointmentTile({
  readonly,
  inspection,
  appointment,
}: Readonly<AppointmentTileProps>) {
  const { date, fromTo } = getFormattedAppointmentParts(appointment);
  const [open, setOpen] = useState(false);
  const showEdit = isNonNullish(appointment) && !readonly;
  const showAddButton = isNullish(appointment) && !readonly;

  function handleAddButtonClick() {
    setOpen(true);
  }

  const handleEdit = showEdit
    ? () => {
        setOpen(true);
      }
    : undefined;

  function handleClose() {
    setOpen(false);
  }

  return (
    <InfoTile
      name="appointment"
      title="Termin"
      footer={
        <>
          {showAddButton && (
            <InfoTileAddButton onClick={handleAddButtonClick}>
              Begehungstermin planen
            </InfoTileAddButton>
          )}
          <AppointmentSidebar
            open={open}
            procedureId={inspection.externalId}
            appointment={inspection.plannedAppointment}
            hoursToAddToEndTime={
              inspection.facility?.objectType?.standardDuration ?? 0
            }
            onClose={handleClose}
          />
        </>
      }
      onEdit={handleEdit}
    >
      {!date && (
        <Alert
          color="primary"
          message="Termin muss ausgewählt sein, um eine Begehung durchzuführen."
        />
      )}
      <DetailsList>
        <DetailsItem label="Datum" value={date} />
        <DetailsItem label="Zeitraum" value={fromTo} />
      </DetailsList>
    </InfoTile>
  );
}
