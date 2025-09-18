/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined } from "remeda";

import { ApiUser } from "@eshg/base-api";
import {
  ApiAppointmentType,
  AppointmentBlockGroupFields,
  AppointmentStaffSelection,
  FormButtonBar,
  FormSheet,
  validateAppointmentBlock,
  validateFieldArray,
} from "@eshg/lib-employee-portal";

import { useAppointmentBlockApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { getValidateDailyAppointmentBlocksForGroupQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentBlocksApi";
import {
  CreateAppointmentBlockGroupValues,
  mapFormValues,
} from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/appointmentBlocksGroupForm/CreateAppointmentBlockGroupForm";
import { APPOINTMENT_TYPE_OPTIONS } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/options";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";

function validateForm(
  values: CreateAppointmentBlockGroupValues,
  appointmentDurations: Record<string, number>,
) {
  const errors: FormikErrors<CreateAppointmentBlockGroupValues> = {};

  const appointmentBlockErrors = validateFieldArray(
    values.appointmentBlocks,
    (appointmentBlock) =>
      validateAppointmentBlock(
        values.types,
        appointmentBlock,
        appointmentDurations,
      ),
  );
  if (isDefined(appointmentBlockErrors)) {
    errors.appointmentBlocks = appointmentBlockErrors;
  }

  return errors;
}

interface AppointmentBlockGroupFormProps {
  initialValues: CreateAppointmentBlockGroupValues;
  onSubmit: (values: CreateAppointmentBlockGroupValues) => Promise<void>;
  standardDuration: Partial<Record<ApiAppointmentType, number>>;
  allPhysicians: ApiUser[];
}

export function AppointmentBlockGroupForm(
  props: Readonly<AppointmentBlockGroupFormProps>,
) {
  const appointmentApi = useAppointmentBlockApi();

  const physicianOptions = props.allPhysicians.map((option) => ({
    userId: option.userId,
    firstName: option.firstName,
    lastName: option.lastName,
  }));

  return (
    <Formik
      initialValues={props.initialValues}
      validate={(values) => validateForm(values, props.standardDuration)}
      onSubmit={props.onSubmit}
    >
      {({ values, isSubmitting, handleSubmit }) => (
        <FormSheet gap={5} aria-label="Terminblock" onSubmit={handleSubmit}>
          <Stack gap={5}>
            <AppointmentBlockGroupFields
              appointmentBlocksWithDays={values.appointmentBlocks}
              options={APPOINTMENT_TYPE_OPTIONS}
              showParallelExaminations
            />
          </Stack>
          <Stack gap={5}>
            <AppointmentStaffSelection
              physicianOptions={physicianOptions}
              physicianRequired="Es muss mindestens ein Arzt/eine Ärztin ausgewählt sein."
              validateAppointmentBlocks={() => mapFormValues(values)}
              getCheckAvailabilityQuery={() =>
                getValidateDailyAppointmentBlocksForGroupQuery(
                  appointmentApi,
                  mapFormValues(values),
                )
              }
            />
          </Stack>
          <Divider />
          <FormButtonBar
            submitLabel="Planen"
            submitting={isSubmitting}
            onCancel={routes.appointmentBlockGroups.index}
          />
        </FormSheet>
      )}
    </Formik>
  );
}
