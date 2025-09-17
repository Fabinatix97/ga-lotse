/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AppointmentBlockGroupValuesWithDays,
  emptyAppointmentBlockGroup,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal";
import {
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/sti-protection-api";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useAppointmentStandardDurationsApi } from "@/lib/businessModules/stiProtection/api/clients";
import { useCreateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/stiProtection/api/mutations/appointmentBlocks";
import { useValidateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/stiProtection/api/queries/appointmentBlocks";
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
  };
}

export function CreateAppointmentBlockGroupForm() {
  const router = useRouter();
  const snackbar = useSnackbar();
  const userApi = useUserApi();
  const appointmentStandardDurationApi = useAppointmentStandardDurationsApi();
  const createDailyAppointmentBlocksForGroup =
    useCreateDailyAppointmentBlocksForGroup();

  const [validateRequest, setValidateRequest] =
    useState<ApiCreateDailyAppointmentBlockGroupRequest | null>(null);
  const [freeStaff, setFreeStaff] = useState<string[]>([]);
  const [blockedStaff, setBlockedStaff] = useState<string[]>([]);

  const validateAppointmentBlockGroup =
    useValidateDailyAppointmentBlocksForGroup(validateRequest);
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
  useEffect(() => {
    if (validateAppointmentBlockGroup.data) {
      const result = validateAppointmentBlockGroup.data;
      setFreeStaff(result.userIdsWithoutEventConflicts);
      setBlockedStaff(result.userIdsWithEventConflicts);
    }
  }, [validateAppointmentBlockGroup]);

  function validateAvailability(values: StiProtectionAppointmentValues) {
    try {
      mapFormValues(values);
    } catch {
      snackbar.notification(
        "Bitte Terminblöcke für die Validierung konfigurieren",
      );
      return;
    }
    if (values.physicians.length === 0 && values.consultants.length === 0) {
      snackbar.notification(
        "Bitte mindestens einen Arzt/eine Ärztin oder ein:e Berater:in für die Validierung auswählen",
      );
      return;
    }
    setValidateRequest(mapFormValues(values));
  }

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
        ...standardDurationsHiv,
        ...standardDurationsSexWork,
      }}
      freeStaff={freeStaff}
      blockedStaff={blockedStaff}
      consultants={allConsultants}
      physicians={allPhysicians}
      validateAvailability={validateAvailability}
      onSubmit={async (values) => {
        await handleSubmit(values);
      }}
    />
  );
}
