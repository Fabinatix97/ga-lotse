/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAppointmentType,
  ApiCreateAppointmentBlock,
  ApiCreateAppointmentBlockGroupRequest,
} from "@eshg/employee-portal-api/schoolEntry";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useUserApi } from "@/lib/baseModule/api/clients";
import {
  useAppointmentTypeApi,
  useConfigApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { AppointmentTypeConfig } from "@/lib/businessModules/schoolEntry/api/models/AppointmentTypeConfig";
import { useCreateAppointmentBlockGroup } from "@/lib/businessModules/schoolEntry/api/mutations/appointmentBlockApi";
import { useValidateAppointmentBlockGroup } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockApi";
import {
  getAllMedicalAssistantsQuery,
  getAllPhysiciansQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/appointmentStaff";
import { getAllAppointmentTypesQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentTypeApi";
import { getLocationSelectionModeQuery } from "@/lib/businessModules/schoolEntry/api/queries/configApi";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import {
  AppointmentBlockValues,
  emptyAppointmentBlock,
} from "@/lib/shared/components/appointmentBlocks/AppointmentBlockForm";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

import { AppointmentBlockGroupForm } from "./AppointmentBlockGroupForm";

const INITIAL_VALUES: CreateAppointmentBlockGroupValues = {
  type: "",
  parallelExaminations: 1,
  appointmentBlocks: [emptyAppointmentBlock()],
  allAppointmentTypes: [],
  physicians: [],
  mfas: [],
  locationId: "",
};

function mapFormValues(
  values: CreateAppointmentBlockGroupValues,
): ApiCreateAppointmentBlockGroupRequest {
  return {
    type: mapRequiredValue(values.type),
    parallelExaminations: mapRequiredValue(values.parallelExaminations),
    appointmentBlocks: values.appointmentBlocks.map(mapAppointmentBlock),
    physicians: values.physicians,
    mfas: values.mfas,
    locationId: mapOptionalValue(values.locationId),
  };
}

function mapAppointmentBlock(
  values: AppointmentBlockValues,
): ApiCreateAppointmentBlock {
  return {
    start: toLocalDateTime(values.date, values.startTime),
    end: toLocalDateTime(values.date, values.endTime),
  };
}

export interface CreateAppointmentBlockGroupValues {
  type: OptionalFieldValue<ApiAppointmentType>;
  parallelExaminations: OptionalFieldValue<number>;
  appointmentBlocks: AppointmentBlockValues[];
  allAppointmentTypes: AppointmentTypeConfig[];
  physicians: string[];
  mfas: string[];
  locationId: OptionalFieldValue<string>;
}

export function CreateAppointmentBlockGroupForm() {
  const snackbar = useSnackbar();
  const router = useRouter();
  const createAppointmentBlockGroup = useCreateAppointmentBlockGroup();
  const [validateRequest, setValidateRequest] =
    useState<ApiCreateAppointmentBlockGroupRequest | null>(null);
  const validateAppointmentBlockGroup =
    useValidateAppointmentBlockGroup(validateRequest);
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
        "Bitte mindestens ein:e Arzt:in oder ein:e MFA für die Validierung auswählen",
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
    await createAppointmentBlockGroup
      .mutateAsync(mapFormValues(values), {
        onSuccess: () => router.push(routes.appointmentBlockGroups.overview),
      })
      .catch();
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
