/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInspection, ApiInspectionAppointment } from "@eshg/inspection-api";
import { DetailsItem } from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { useState } from "react";
import { isNonNullish, isNullish } from "remeda";

import { AppointmentSidebar } from "@/lib/businessModules/inspection/components/inspection/common/appointment/AppointmentSidebar";
import { getFormattedAppointmentParts } from "@/lib/businessModules/inspection/components/inspection/common/appointment/appointmentUtils";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

export interface AppointmentTileProps {
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
      onEdit={handleEdit}
      footer={
        <>
          {showAddButton && (
            <InfoTileAddButton onClick={handleAddButtonClick}>
              Begehungstermin planen
            </InfoTileAddButton>
          )}
          <AppointmentSidebar
            open={open}
            onClose={handleClose}
            procedureId={inspection.externalId}
            appointment={inspection.plannedAppointment}
            hoursToAddToEndTime={
              inspection.facility?.objectType?.standardDuration ?? 0
            }
          />
        </>
      }
    >
      {!date && (
        <Alert
          color="primary"
          message="Termin muss ausgewählt sein, um eine Begehung durchzuführen."
        />
      )}
      <DetailsItem label="Datum" value={date} />
      <DetailsItem label="Zeitraum" value={fromTo} />
    </InfoTile>
  );
}
