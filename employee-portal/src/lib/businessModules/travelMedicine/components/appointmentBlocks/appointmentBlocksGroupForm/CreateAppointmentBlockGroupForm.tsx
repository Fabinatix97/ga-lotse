/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useCreateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/travelMedicine/api/mutations/appointmentBlocks";
import { useValidateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/travelMedicine/api/queries/appointmentBlocks";
import {
  useGetAllMedicalAssistantsQuery,
  useGetAllPhysiciansQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/appointmentStaff";
import { useGetAllAppointmentTypesQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentTypes";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import {
  AppointmentBlockGroupValuesWithDays,
  emptyAppointmentBlockGroup,
} from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import { isTimeString, toLocalDateTime } from "@/lib/shared/helpers/dateTime";

import {
  AppointmentBlockGroupForm,
  AppointmentBlockGroupValues,
} from "./AppointmentBlockGroupForm";

const INITIAL_VALUES: AppointmentBlockGroupValues = {
  type: "",
  parallelExaminations: 1,
  appointmentBlocks: [emptyAppointmentBlockGroup()],
  allAppointmentTypes: {},
  mfas: [],
  physicians: [],
};

function mapFormValues(
  values: AppointmentBlockGroupValues,
): ApiCreateDailyAppointmentBlockGroupRequest {
  return {
    type: mapRequiredValue(values.type),
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
  const [
    { data: allPhysicians },
    { data: allMedicalAssistants },
    { data: allAppointmentTypes },
  ] = useSuspenseQueries({
    queries: [
      useGetAllPhysiciansQuery(),
      useGetAllMedicalAssistantsQuery(),
      useGetAllAppointmentTypesQuery(),
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

  const appointmentTypesRecord: Record<string, number> = {};
  allAppointmentTypes.forEach(
    (currentType) =>
      (appointmentTypesRecord[currentType.appointmentTypeDto] =
        currentType.standardDurationInMinutes),
  );

  INITIAL_VALUES.allAppointmentTypes = appointmentTypesRecord;
  INITIAL_VALUES.physicians = [];
  INITIAL_VALUES.mfas = [];

  function validateAvailability(values: AppointmentBlockGroupValues) {
    try {
      mapFormValues(values);
    } catch {
      snackbar.notification(
        "Bitte Terminblöcke für die Validierung konfigurieren",
      );
      return;
    }
    if (values.physicians.length == 0 && values.mfas.length == 0) {
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
      allPhysicians={allPhysicians}
      allMedicalAssistants={allMedicalAssistants}
      onSubmit={handleSubmit}
      validateAvailability={validateAvailability}
      freeStaff={freeStaff}
      blockedStaff={blockedStaff}
    />
  );
}
