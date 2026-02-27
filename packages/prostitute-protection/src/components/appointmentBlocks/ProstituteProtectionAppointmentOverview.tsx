/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Settings } from "@mui/icons-material";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  AppointmentOverview,
  useGetUsersByGroupQuery,
} from "@eshg/lib-employee-portal";
import { InternalLinkButton } from "@eshg/lib-portal";

import { mapAppointmentBlockApi } from "../../api/mapAppointmentBlockApi";
import { appointmentBlockApiQueryKey } from "../../api/queries/apiQueryKeys";
import { useGetAppointmentStandardDurationOptions } from "../../api/queries/appointmentStandardDuration";
import { routes } from "../../config/routes";
import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";
import { PROSTITUTE_PROTECTION_GROUP_NAME } from "../../shared/constants";

import { APPOINTMENT_TYPES } from "./ProstituteProtectionCreateAppointmentBlockGroupForm";

export function ProstituteProtectionAppointmentOverview() {
  const { appointmentBlockApi, appointmentStandardDurationApi } =
    useProstituteProtectionApiClients();
  const mappedAppointmentBlockApi = mapAppointmentBlockApi(appointmentBlockApi);

  const [{ data: standardDurations }, { data: allConsultants }] =
    useSuspenseQueries({
      queries: [
        useGetAppointmentStandardDurationOptions(
          appointmentStandardDurationApi,
        ),
        useGetUsersByGroupQuery(PROSTITUTE_PROTECTION_GROUP_NAME),
      ],
    });

  return (
    <AppointmentOverview
      buttons={
        <>
          <InternalLinkButton href={routes.appointments.new}>
            Terminblock hinzufügen
          </InternalLinkButton>
          <InternalLinkButton
            color="primary"
            variant="outlined"
            href={routes.appointments.appointmentBlockGroups}
            endDecorator={<Settings />}
          >
            Terminblöcke bearbeiten
          </InternalLinkButton>
        </>
      }
      appointmentBlockApi={mappedAppointmentBlockApi}
      consultants={allConsultants}
      standardDurations={standardDurations}
      appointmentBlockApiQueryKey={appointmentBlockApiQueryKey}
      withTeam
      appointmentTypes={APPOINTMENT_TYPES}
      detailsHref={(procedureId: string) =>
        routes.procedures.byId(procedureId).details
      }
    />
  );
}
