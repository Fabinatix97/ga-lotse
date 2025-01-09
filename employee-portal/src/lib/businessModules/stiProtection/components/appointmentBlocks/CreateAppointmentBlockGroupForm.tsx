/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlock,
  ApiCreateDailyAppointmentBlockGroupRequest,
} from "@eshg/employee-portal-api/stiProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useAppointmentTypeApi } from "@/lib/businessModules/stiProtection/api/clients";
import { mapAppointmentTypeConfig } from "@/lib/businessModules/stiProtection/api/models/AppointmentTypeConfig";
import { useCreateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/stiProtection/api/mutations/appointmentBlocks";
import { useValidateDailyAppointmentBlocksForGroup } from "@/lib/businessModules/stiProtection/api/queries/appointmentBlocks";
import {
  getAllConsultantsQuery,
  getAllPhysiciansQuery,
} from "@/lib/businessModules/stiProtection/api/queries/appointmentStaff";
import { getAllAppointmentTypesQuery } from "@/lib/businessModules/stiProtection/api/queries/appointmentTypes";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import {
  AppointmentBlockGroupValuesWithDays,
  emptyAppointmentBlockGroup,
} from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

import {
  AppointmentBlockGroupForm,
  AppointmentBlockGroupValues,
  StiProtectionAppointmentValues,
} from "./AppointmentBlockGroupForm";

const INITIAL_VALUES: StiProtectionAppointmentValues = {
  type: ApiAppointmentType.HivStiConsultation,
  appointmentBlocks: [emptyAppointmentBlockGroup()],
  allAppointmentTypes: [],
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
    type: mapRequiredValue(values.type),
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
  const appointmentTypeApi = useAppointmentTypeApi();
  const createDailyAppointmentBlocksForGroup =
    useCreateDailyAppointmentBlocksForGroup();

  const [validateRequest, setValidateRequest] =
    useState<ApiCreateDailyAppointmentBlockGroupRequest | null>(null);
  const [freeStaff, setFreeStaff] = useState<string[]>([]);
  const [blockedStaff, setBlockedStaff] = useState<string[]>([]);

  const validateAppointmentBlockGroup =
    useValidateDailyAppointmentBlocksForGroup(validateRequest);
  const [
    { data: allAppointmentTypesData },
    { data: allPhysicians },
    { data: allConsultants },
  ] = useSuspenseQueries({
    queries: [
      getAllAppointmentTypesQuery(appointmentTypeApi),
      getAllPhysiciansQuery(userApi),
      getAllConsultantsQuery(userApi),
    ],
  });

  const allAppointmentTypes = useMemo(
    () => allAppointmentTypesData.map(mapAppointmentTypeConfig),
    [allAppointmentTypesData],
  );
  const initialValues = {
    ...INITIAL_VALUES,
    allAppointmentTypes: allAppointmentTypesData,
  };

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
    if (values.physicians.length == 0 && values.consultants.length == 0) {
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
      initialValues={initialValues}
      appointmentTypes={allAppointmentTypes}
      freeStaff={freeStaff}
      blockedStaff={blockedStaff}
      consultants={allConsultants}
      physicians={allPhysicians}
      onSubmit={async (values) => {
        await handleSubmit(values);
      }}
      validateAvailability={validateAvailability}
    />
  );
}
