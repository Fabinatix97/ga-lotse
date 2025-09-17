/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ApiAddContact200Response } from "@eshg/base-api";
import {
  AppointmentBlockGroupValuesWithDays,
  emptyAppointmentBlockGroup,
} from "@eshg/lib-employee-portal";
import {
  OptionalFieldValue,
  mapOptionalValue,
  mapRequiredValue,
  useSnackbar,
} from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/school-entry-api";

import { useUserApi } from "@/lib/baseModule/api/clients";
import {
  useAppointmentBlockDefaultAvailabilityApi,
  useAppointmentStandardDurationsApi,
  useConfigApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { useCreateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/schoolEntry/api/mutations/appointmentBlockApi";
import { useValidateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockApi";
import { getAppointmentBlockDefaultAvailabilityQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockDefaultAvailabilityApi";
import {
  getAllMedicalAssistantsQuery,
  getAllPhysiciansQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/appointmentStaff";
import { useGetAppointmentStandardDurationsQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentStandardDuration";
import { getLocationSelectionModeQuery } from "@/lib/businessModules/schoolEntry/api/queries/configApi";
import { SUPPORTED_APPOINTMENT_TYPES } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

import { AppointmentBlockGroupForm } from "./AppointmentBlockGroupForm";

const INITIAL_VALUES: CreateAppointmentBlockGroupValues = {
  types: SUPPORTED_APPOINTMENT_TYPES,
  parallelExaminations: 1,
  appointmentBlocks: [emptyAppointmentBlockGroup()],
  physicians: [],
  mfas: [],
  location: null,
  availableForCitizen: true,
  availableForBulkBooking: true,
};

function mapFormValues(
  values: CreateAppointmentBlockGroupValues,
): ApiCreateDailyAppointmentBlockGroupRequest {
  return {
    types: values.types,
    parallelExaminations: mapRequiredValue(values.parallelExaminations),
    appointmentBlocks: values.appointmentBlocks.map(mapAppointmentBlock),
    physicians: values.physicians,
    mfas: values.mfas,
    locationId: mapOptionalValue(values.location)?.id,
    availableForCitizen: values.availableForCitizen,
    availableForBulkBooking: values.availableForBulkBooking,
  };
}

function mapAppointmentBlock(
  values: AppointmentBlockGroupValuesWithDays,
): ApiCreateDailyAppointmentBlock {
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
  mfas: string[];
  location: ApiAddContact200Response | null;
  availableForCitizen: boolean;
  availableForBulkBooking: boolean;
}

export function CreateAppointmentBlockGroupForm() {
  const snackbar = useSnackbar();
  const router = useRouter();
  const createDailyAppointmentBlockGroup =
    useCreateDailyAppointmentBlocksForGroup();
  const [validateRequest, setValidateRequest] =
    useState<ApiCreateDailyAppointmentBlockGroupRequest | null>(null);
  const validateAppointmentBlockGroup =
    useValidateDailyAppointmentBlocksForGroup(validateRequest);
  const configApi = useConfigApi();
  const userApi = useUserApi();
  const appointmentBlockDefaultAvailabilityApi =
    useAppointmentBlockDefaultAvailabilityApi();
  const standardDurationApi = useAppointmentStandardDurationsApi();

  const [
    { data: locationSelectionMode },
    { data: standardDurations },
    { data: allPhysicians },
    { data: allMfas },
    { data: defaultAvailabilityFlags },
  ] = useSuspenseQueries({
    queries: [
      getLocationSelectionModeQuery(configApi),
      useGetAppointmentStandardDurationsQuery(standardDurationApi),
      getAllPhysiciansQuery(userApi),
      getAllMedicalAssistantsQuery(userApi),
      getAppointmentBlockDefaultAvailabilityQuery(
        appointmentBlockDefaultAvailabilityApi,
      ),
    ],
  });

  const initialValues = {
    ...INITIAL_VALUES,
    ...defaultAvailabilityFlags,
  };
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
    if (values.physicians.length === 0 && values.mfas.length === 0) {
      snackbar.notification(
        "Bitte mindestens einen Arzt/eine Ärztin oder ein:e MFA für die Validierung auswählen",
      );
      return;
    }
    setValidateRequest(mapFormValues(values));
  }

  useEffect(() => {
    if (validateAppointmentBlockGroup.data) {
      const result = validateAppointmentBlockGroup.data;
      setFreeStaff(result.userIdsWithoutEventConflicts);
      setBlockedStaff(result.userIdsWithEventConflicts);
    }
  }, [validateAppointmentBlockGroup]);

  async function handleSubmit(values: CreateAppointmentBlockGroupValues) {
    await createDailyAppointmentBlockGroup.mutateAsync(mapFormValues(values), {
      onSuccess: () => router.push(routes.appointments.overview),
    });
  }

  return (
    <AppointmentBlockGroupForm
      initialValues={initialValues}
      standardDurations={standardDurations}
      allPhysicians={allPhysicians}
      allMfas={allMfas}
      validateAvailability={validateAvailability}
      freeStaff={freeStaff}
      blockedStaff={blockedStaff}
      locationSelectionMode={locationSelectionMode}
      onSubmit={handleSubmit}
    />
  );
}
