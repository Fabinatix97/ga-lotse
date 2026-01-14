/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik } from "formik";

import {
  AppointmentRoomField,
  AppointmentStaffSelection,
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

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
import {
  AppointmentCriteria,
  UseBulkCreateAppointmentResult,
} from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkCreateAppointments/useBulkCreateAppointment";

export function useBulkCreateAppointmentsSidebar(): UseSidebarWithFormRefResult<BulkCreateAppointmentsSidebar> {
  return useSidebarWithFormRef({
    component: BulkCreateAppointmentsSidebar,
  });
}

interface BulkCreateAppointmentsSidebar extends SidebarWithFormRefProps {
  startAppointmentCreation: UseBulkCreateAppointmentResult["startAppointmentCreation"];
}

interface BulkCreateAppointmentValues {
  physicians: string;
  mfas: string;
  sopasss: string;
  room: string;
}

function BulkCreateAppointmentsSidebar(props: BulkCreateAppointmentsSidebar) {
  const appointmentBlockApi = useAppointmentBlockApi();
  const userApi = useUserApi();
  const standardDurationApi = useAppointmentStandardDurationsApi();

  const INITIAL_VALUES: BulkCreateAppointmentValues = {
    physicians: "",
    mfas: "",
    sopasss: "",
    room: "",
  };

  const [
    { data: allPhysicians },
    { data: allMfas },
    { data: allSopasss },
    { data: standardDurations },
  ] = useSuspenseQueries({
    queries: [
      getAllPhysiciansQuery(userApi),
      getAllMedicalAssistantsQuery(userApi),
      getAllSopassQualifiedMFAsQuery(userApi),
      useGetAppointmentStandardDurationsQuery(standardDurationApi),
    ],
  });

  const physicianOptions = allPhysicians.map((option) => ({
    userId: option.userId,
    firstName: option.firstName,
    lastName: option.lastName,
  }));

  const medicalAssistantsOptions = allMfas.map((option) => ({
    userId: option.userId,
    firstName: option.firstName,
    lastName: option.lastName,
  }));

  const sopassOptions = standardDurations.extraDuration
    ? allSopasss.map((option) => ({
        userId: option.userId,
        firstName: option.firstName,
        lastName: option.lastName,
      }))
    : undefined;

  async function handleSubmit(data: BulkCreateAppointmentValues) {
    await props.startAppointmentCreation(mapToRequest(data));
    props.onClose(true);
  }

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title="Termine zuweisen">
            <Stack gap={2}>
              <AppointmentStaffSelection
                singleSelection
                physicianOptions={physicianOptions}
                medicalAssistantOptions={medicalAssistantsOptions}
                sopassOptions={sopassOptions}
                singleColumn
              />

              <AppointmentRoomField
                appointmentBlockApi={mapAppointmentBlockApi(
                  appointmentBlockApi,
                )}
                queryKey={appointmentBlockApiQueryKey}
              />
            </Stack>
          </SidebarContent>

          <SidebarActions>
            <FormButtonBar
              submitLabel="Termine zuweisen"
              submitting={isSubmitting}
              onCancel={() => props.onClose(true)}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function mapToRequest(
  values: BulkCreateAppointmentValues,
): AppointmentCriteria {
  return {
    physicianId: values.physicians !== "" ? values.physicians : undefined,
    mfaId: values.mfas !== "" ? values.mfas : undefined,
    sopassId: values.sopasss !== "" ? values.sopasss : undefined,
    room: values.room !== "" ? values.room : undefined,
  };
}
