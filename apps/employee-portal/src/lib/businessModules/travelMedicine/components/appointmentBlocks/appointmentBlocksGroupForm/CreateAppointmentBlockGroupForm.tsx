/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
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
import { isTimeString, mapRequiredValue, useSnackbar } from "@eshg/lib-portal";
import {
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/travel-medicine-api";

import { useAppointmentStandardDurationsApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { useCreateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/travelMedicine/api/mutations/appointmentBlocks";
import { useValidateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/travelMedicine/api/queries/appointmentBlocks";
import {
  useGetAllMedicalAssistantsQuery,
  useGetAllPhysiciansQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/appointmentStaff";
import { useGetAppointmentStandardDurationsQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentStandardDurations";
import { SUPPORTED_APPOINTMENT_TYPES } from "@/lib/businessModules/travelMedicine/components/appointmentBlocks/options";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

import {
  AppointmentBlockGroupForm,
  AppointmentBlockGroupValues,
} from "./AppointmentBlockGroupForm";

const INITIAL_VALUES: AppointmentBlockGroupValues = {
  types: SUPPORTED_APPOINTMENT_TYPES,
  parallelExaminations: 1,
  appointmentBlocks: [emptyAppointmentBlockGroup()],
  mfas: [],
  physicians: [],
};

function mapFormValues(
  values: AppointmentBlockGroupValues,
): ApiCreateDailyAppointmentBlockGroupRequest {
  return {
    types: values.types,
    parallelExaminations: mapRequiredValue(values.parallelExaminations),
    appointmentBlocks: values.appointmentBlocks.map(mapAppointmentBlock),
    physicians: values.physicians,
    mfas: values.mfas,
  };
}

function mapAppointmentBlock(
  values: AppointmentBlockGroupValuesWithDays,
): ApiCreateDailyAppointmentBlock {
  if (!isTimeString(values.startTime) || !isTimeString(values.endTime)) {
    throw new Error("Invalid time string");
  }
  return {
    daysOfWeek: values.daysOfWeek,
    start: toLocalDateTime(values.startDate, values.startTime),
    end: toLocalDateTime(values.endDate, values.endTime),
  };
}

export function CreateAppointmentBlockGroupForm() {
  const snackbar = useSnackbar();
  const standardDurationApi = useAppointmentStandardDurationsApi();
  const [
    { data: allPhysicians },
    { data: allMedicalAssistants },
    { data: standardDurations },
  ] = useSuspenseQueries({
    queries: [
      useGetAllPhysiciansQuery(),
      useGetAllMedicalAssistantsQuery(),
      useGetAppointmentStandardDurationsQuery(standardDurationApi),
    ],
  });
  const [freeStaff, setFreeStaff] = useState<string[]>([]);
  const [blockedStaff, setBlockedStaff] = useState<string[]>([]);
  const [validateRequest, setValidateRequest] =
    useState<ApiCreateDailyAppointmentBlockGroupRequest | null>(null);

  const router = useRouter();
  const createDailyAppointmentBlocksForGroup =
    useCreateDailyAppointmentBlocksForGroup();
  const validateDailyAppointmentBlocksForGroup =
    useValidateDailyAppointmentBlocksForGroup(validateRequest);

  function validateAvailability(values: AppointmentBlockGroupValues) {
    try {
      mapFormValues(values);
    } catch {
      snackbar.notification(
        "Bitte Terminblöcke für die Validierung konfigurieren",
      );
      return;
    }
    if (values.physicians.length === 0 && values.mfas.length === 0) {
      snackbar.notification(
        "Bitte mindestens einen Arzt/eine Ärztin oder ein:e MFA für die Validierung auswählen",
      );
      return;
    }
    setValidateRequest(mapFormValues(values));
  }

  useEffect(() => {
    if (validateDailyAppointmentBlocksForGroup.data) {
      const result = validateDailyAppointmentBlocksForGroup.data;
      setFreeStaff(result.userIdsWithoutEventConflicts);
      setBlockedStaff(result.userIdsWithEventConflicts);
    }
  }, [validateDailyAppointmentBlocksForGroup]);

  async function handleSubmit(values: AppointmentBlockGroupValues) {
    await createDailyAppointmentBlocksForGroup.mutateAsync(
      mapFormValues(values),
      {
        onSuccess: () => router.push(routes.appointmentBlockGroups.index),
      },
    );
  }

  return (
    <AppointmentBlockGroupForm
      initialValues={INITIAL_VALUES}
      standardDurations={standardDurations}
      allPhysicians={allPhysicians}
      allMedicalAssistants={allMedicalAssistants}
      validateAvailability={validateAvailability}
      freeStaff={freeStaff}
      blockedStaff={blockedStaff}
      onSubmit={handleSubmit}
    />
  );
}
