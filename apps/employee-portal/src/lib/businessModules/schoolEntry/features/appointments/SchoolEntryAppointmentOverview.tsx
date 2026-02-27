/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Settings } from "@mui/icons-material";
import { useSuspenseQueries } from "@tanstack/react-query";

import { AppointmentOverview } from "@eshg/lib-employee-portal";
import { InternalLinkButton } from "@eshg/lib-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import {
  useAppointmentBlockApi,
  useAppointmentStandardDurationsApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { mapAppointmentBlockApi } from "@/lib/businessModules/schoolEntry/api/mapAppointmentBlockApi";
import { appointmentBlockApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";
import {
  getAllMedicalAssistantsQuery,
  getAllPhysiciansQuery,
  getAllSopassQualifiedMFAsQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/appointmentStaff";
import { useGetAppointmentStandardDurationsQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentStandardDuration";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

export function SchoolEntryAppointmentOverview() {
  const appointmentBlockApi = useAppointmentBlockApi();
  const standardDurationApi = useAppointmentStandardDurationsApi();
  const userApi = useUserApi();

  const [
    { data: standardDurations },
    { data: physicians },
    { data: mfas },
    { data: sopasss },
  ] = useSuspenseQueries({
    queries: [
      useGetAppointmentStandardDurationsQuery(standardDurationApi),
      getAllPhysiciansQuery(userApi),
      getAllMedicalAssistantsQuery(userApi),
      getAllSopassQualifiedMFAsQuery(userApi),
    ],
  });

  return (
    <AppointmentOverview
      buttons={
        <>
          <InternalLinkButton
            href={routes.appointments.appointmentBlockGroups.new}
          >
            Terminblock hinzufügen
          </InternalLinkButton>
          <InternalLinkButton
            color="primary"
            variant="outlined"
            href={routes.appointments.appointmentBlockGroups.overview}
            endDecorator={<Settings />}
          >
            Terminblöcke bearbeiten
          </InternalLinkButton>
        </>
      }
      standardDurations={standardDurations}
      appointmentBlockApi={mapAppointmentBlockApi(appointmentBlockApi)}
      withTeam
      appointmentBlockApiQueryKey={appointmentBlockApiQueryKey}
      physicians={physicians}
      mfas={mfas}
      sopasss={sopasss}
      detailsHref={(procedureId: string) =>
        routes.procedures.byId(procedureId).details
      }
    />
  );
}
