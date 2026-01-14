/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  AppointmentBlockGroupValuesWithDays,
  emptyAppointmentBlockGroup,
} from "@eshg/lib-employee-portal";
import { mapOptionalValue } from "@eshg/lib-portal";
import {
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/sti-protection-api";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useAppointmentStandardDurationsApi } from "@/lib/businessModules/stiProtection/api/clients";
import { useCreateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/stiProtection/api/mutations/appointmentBlocks";
import {
  getAllConsultantsQuery,
  getAllPhysiciansQuery,
} from "@/lib/businessModules/stiProtection/api/queries/appointmentStaff";
import {
  useGetHivAppointmentStandardDurationsQuery,
  useGetSexWorkAppointmentStandardDurationsQuery,
} from "@/lib/businessModules/stiProtection/api/queries/appointmentStandardDuration";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

import {
  AppointmentBlockGroupForm,
  AppointmentBlockGroupValues,
  StiProtectionAppointmentValues,
} from "./AppointmentBlockGroupForm";
import { SUPPORTED_APPOINTMENT_TYPES } from "./options";

const INITIAL_VALUES: StiProtectionAppointmentValues = {
  types: SUPPORTED_APPOINTMENT_TYPES,
  appointmentBlocks: [emptyAppointmentBlockGroup()],
  physicians: [],
  consultants: [],
  parallelExaminations: 1,
  locationId: "",
  room: "",
};

function mapAppointmentBlock(
  values: AppointmentBlockGroupValuesWithDays,
): ApiCreateDailyAppointmentBlock {
  return {
    daysOfWeek: values.daysOfWeek,
    start: toLocalDateTime(values.startDate, values.startTime),
    end: toLocalDateTime(values.endDate, values.endTime),
  };
}

export function mapFormValues(
  values: StiProtectionAppointmentValues,
): ApiCreateDailyAppointmentBlockGroupRequest {
  return {
    types: values.types,
    parallelExaminations: 1,
    appointmentBlocks: values.appointmentBlocks.map(mapAppointmentBlock),
    physicians: values.physicians,
    consultants: values.consultants,
    room: mapOptionalValue(values.room),
  };
}

export function CreateAppointmentBlockGroupForm() {
  const router = useRouter();
  const userApi = useUserApi();
  const appointmentStandardDurationApi = useAppointmentStandardDurationsApi();
  const createDailyAppointmentBlocksForGroup =
    useCreateDailyAppointmentBlocksForGroup();

  const [
    { data: standardDurationsHiv },
    { data: standardDurationsSexWork },
    { data: allPhysicians },
    { data: allConsultants },
  ] = useSuspenseQueries({
    queries: [
      useGetHivAppointmentStandardDurationsQuery(
        appointmentStandardDurationApi,
      ),
      useGetSexWorkAppointmentStandardDurationsQuery(
        appointmentStandardDurationApi,
      ),
      getAllPhysiciansQuery(userApi),
      getAllConsultantsQuery(userApi),
    ],
  });

  async function handleSubmit(values: AppointmentBlockGroupValues) {
    const appointmentBlockGroupValues = mapFormValues(values);
    await createDailyAppointmentBlocksForGroup.mutateAsync(
      appointmentBlockGroupValues,
      {
        onSuccess: () => {
          router.push(routes.appointmentBlockGroups.index);
        },
      },
    );
  }

  return (
    <AppointmentBlockGroupForm
      initialValues={INITIAL_VALUES}
      standardDurations={{
        standardDurations: {
          ...standardDurationsHiv,
          ...standardDurationsSexWork,
        },
        extraDuration: 0,
      }}
      consultants={allConsultants}
      physicians={allPhysicians}
      onSubmit={async (values) => {
        await handleSubmit(values);
      }}
    />
  );
}
