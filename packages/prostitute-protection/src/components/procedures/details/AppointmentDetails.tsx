/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider } from "@mui/joy";

import {
  ContentPanel,
  DetailsItem,
  DetailsSection,
  EditButton,
} from "@eshg/lib-employee-portal";
import { DetailsColumn } from "@eshg/lib-portal";
import { ApiProcedureDetails } from "@eshg/prostitute-protection-api";

import { APPOINTMENT_FIELD_NAME } from "../../../shared/constants";
import {
  formatAppointmentTime,
  formatDuration,
  isProcedureFinalized,
} from "../../../shared/helpers";

import { useEditAppointmentDetailsSidebar } from "./sidebar/EditAppointmentDetailsSidebar";

export function AppointmentDetails({
  procedure,
}: Readonly<{ procedure: ApiProcedureDetails }>) {
  const editAppointmentDetailsSidebar =
    useEditAppointmentDetailsSidebar(procedure);

  return (
    <ContentPanel>
      <DetailsSection
        title="Termin"
        buttons={
          !isProcedureFinalized(procedure) && (
            <EditButton
              aria-label="Termin bearbeiten"
              onClick={() => editAppointmentDetailsSidebar.open()}
            />
          )
        }
      >
        <DetailsColumn>
          <DetailsItem
            label={APPOINTMENT_FIELD_NAME.appointmentStart}
            value={formatAppointmentTime(procedure.appointment?.start)}
          />
          <DetailsItem
            label={APPOINTMENT_FIELD_NAME.appointmentDuration}
            value={formatDuration(
              procedure.appointment?.start,
              procedure.appointment?.end,
            )}
          />
          <Divider />
        </DetailsColumn>
      </DetailsSection>
    </ContentPanel>
  );
}
