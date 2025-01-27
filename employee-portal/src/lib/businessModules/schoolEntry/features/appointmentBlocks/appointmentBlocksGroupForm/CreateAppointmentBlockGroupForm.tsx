/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiAddContact200Response } from "@eshg/base-api";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/school-entry-api";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useUserApi } from "@/lib/baseModule/api/clients";
import {
  useAppointmentTypeApi,
  useConfigApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { AppointmentTypeConfig } from "@/lib/businessModules/schoolEntry/api/models/AppointmentTypeConfig";
import { useCreateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/schoolEntry/api/mutations/appointmentBlockApi";
import { useValidateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockApi";
import {
  getAllMedicalAssistantsQuery,
  getAllPhysiciansQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/appointmentStaff";
import { getAllAppointmentTypesQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentTypeApi";
import { getLocationSelectionModeQuery } from "@/lib/businessModules/schoolEntry/api/queries/configApi";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import {
  AppointmentBlockGroupValuesWithDays,
  emptyAppointmentBlockGroup,
} from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

import { AppointmentBlockGroupForm } from "./AppointmentBlockGroupForm";

const INITIAL_VALUES: CreateAppointmentBlockGroupValues = {
  type: "",
  parallelExaminations: 1,
  appointmentBlocks: [emptyAppointmentBlockGroup()],
  allAppointmentTypes: [],
  physicians: [],
  mfas: [],
  location: null,
};

function mapFormValues(
  values: CreateAppointmentBlockGroupValues,
): ApiCreateDailyAppointmentBlockGroupRequest {
  return {
    type: mapRequiredValue(values.type),
    parallelExaminations: mapRequiredValue(values.parallelExaminations),
    appointmentBlocks: values.appointmentBlocks.map(mapAppointmentBlock),
    physicians: values.physicians,
    mfas: values.mfas,
    locationId: mapOptionalValue(values.location)?.id,
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
  type: OptionalFieldValue<ApiAppointmentType>;
  parallelExaminations: OptionalFieldValue<number>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  allAppointmentTypes: AppointmentTypeConfig[];
  physicians: string[];
  mfas: string[];
  location: ApiAddContact200Response | null;
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
  const appointmentTypeApi = useAppointmentTypeApi();
  const userApi = useUserApi();
  const [
    { data: locationSelectionMode },
    { data: allAppointmentTypes },
    { data: allPhysicians },
    { data: allMfas },
  ] = useSuspenseQueries({
    queries: [
      getLocationSelectionModeQuery(configApi),
      getAllAppointmentTypesQuery(appointmentTypeApi),
      getAllPhysiciansQuery(userApi),
      getAllMedicalAssistantsQuery(userApi),
    ],
  });

  const initialValues = { ...INITIAL_VALUES, allAppointmentTypes };
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
    if (values.physicians.length == 0 && values.mfas.length == 0) {
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
      onSuccess: () => router.push(routes.appointmentBlockGroups.overview),
    });
  }

  return (
    <AppointmentBlockGroupForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      allAppointmentTypes={allAppointmentTypes}
      allPhysicians={allPhysicians}
      allMfas={allMfas}
      validateAvailability={validateAvailability}
      freeStaff={freeStaff}
      blockedStaff={blockedStaff}
      locationSelectionMode={locationSelectionMode}
    />
  );
}
