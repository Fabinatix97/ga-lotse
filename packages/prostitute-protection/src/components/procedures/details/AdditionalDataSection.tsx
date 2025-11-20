/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Sheet } from "@mui/joy";
import { addMinutes, differenceInMinutes, format } from "date-fns";
import { de } from "date-fns/locale";

import { DetailsItem, DetailsSection } from "@eshg/lib-employee-portal";
import { DetailsColumn } from "@eshg/lib-portal";

import { ApiProstituteProtectionProcedure } from "../../../mock";

function formatAppointmentTime(date?: Date) {
  if (date === undefined) {
    return "-";
  }
  return `${format(date, "dd.MM.yyyy", { locale: de })}, ${format(date, "HH:mm", { locale: de })} Uhr`;
}

function formatDuration(start?: Date, end?: Date) {
  if (start === undefined || end === undefined) {
    return "-";
  }
  const durationMinutes = differenceInMinutes(end, start);
  return `${durationMinutes} min`;
}

const consultationDurationInMinutes = 30;

export function AdditionalDataSection({
  procedure,
}: Readonly<{ procedure: ApiProstituteProtectionProcedure }>) {
  return (
    <Sheet>
      <DetailsSection title="Zusatzinfos">
        <DetailsColumn>
          <DetailsItem
            label="Zeitpunkt"
            value={formatAppointmentTime(procedure.consultationDate)}
          />
          <DetailsItem
            label="Dauer"
            value={formatDuration(
              procedure.consultationDate,
              addMinutes(
                new Date(procedure.consultationDate),
                consultationDurationInMinutes,
              ),
            )}
          />
          <Divider />
          <DetailsItem label="Berater/in" value={procedure.consultant} />
          <DetailsItem label="Angelegt von" value={procedure.consultant} />
        </DetailsColumn>
      </DetailsSection>
    </Sheet>
  );
}
