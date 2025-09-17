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
import {
  OptionalFieldValue,
  isTimeString,
  mapRequiredValue,
  useSnackbar,
} from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/official-medical-service-api";

import { useCreateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/officialMedicalService/api/mutations/appointmentBlocksApi";
import { useValidateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentBlocksApi";
import { useGetAllPhysiciansQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentStaffApi";
import { useGetAppointmentStandardDurationQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentStandardDurationsApi";
import { AppointmentBlockGroupForm } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/appointmentBlocksGroupForm/AppointmentBlockGroupForm";
import { SUPPORTED_APPOINTMENT_TYPES } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/options";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

const INITIAL_VALUES: CreateAppointmentBlockGroupValues = {
  types: SUPPORTED_APPOINTMENT_TYPES,
  parallelExaminations: 1,
  appointmentBlocks: [emptyAppointmentBlockGroup()],
  physicians: [],
};

function mapFormValues(
  values: CreateAppointmentBlockGroupValues,
): ApiCreateDailyAppointmentBlockGroupRequest {
  return {
    types: values.types,
    parallelExaminations: mapRequiredValue(values.parallelExaminations),
    appointmentBlocks: values.appointmentBlocks.map(mapAppointmentBlock),
    physicians: values.physicians,
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

export interface CreateAppointmentBlockGroupValues {
  types: ApiAppointmentType[];
  parallelExaminations: OptionalFieldValue<number>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  physicians: string[];
}

export function CreateAppointmentBlockGroupForm() {
  const snackbar = useSnackbar();
  const router = useRouter();
  const createDailyAppointmentBlocksForGroup =
    useCreateDailyAppointmentBlocksForGroup();
  const [validateRequest, setValidateRequest] =
    useState<ApiCreateDailyAppointmentBlockGroupRequest | null>(null);
  const validateDailyAppointmentBlocksForGroup =
    useValidateDailyAppointmentBlocksForGroup(validateRequest);

  const [{ data: allPhysicians }, { data: standardDurations }] =
    useSuspenseQueries({
      queries: [
        useGetAllPhysiciansQuery(),
        useGetAppointmentStandardDurationQuery(),
      ],
    });

  const [freeStaff, setFreeStaff] = useState<string[]>([]);
  const [blockedStaff, setBlockedStaff] = useState<string[]>([]);

  function validateAvailability(values: CreateAppointmentBlockGroupValues) {
    try {
      mapFormValues(values);
    } catch {
      snackbar.notification(
        "Bitte Terminblöcke für die Validierung konfigurieren",
      );
      return;
    }
    if (values.physicians.length === 0) {
      snackbar.notification(
        "Bitte mindestens einen Arzt/eine Ärztin für die Validierung auswählen",
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

  async function handleSubmit(values: CreateAppointmentBlockGroupValues) {
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
      standardDuration={standardDurations}
      allPhysicians={allPhysicians}
      validateAvailability={validateAvailability}
      freeStaff={freeStaff}
      blockedStaff={blockedStaff}
      onSubmit={handleSubmit}
    />
  );
}
