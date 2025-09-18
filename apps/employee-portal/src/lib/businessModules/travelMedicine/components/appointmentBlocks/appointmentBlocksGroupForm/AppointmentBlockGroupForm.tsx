/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined, isEmpty } from "remeda";

import { ApiUser } from "@eshg/base-api";
import {
  AppointmentBlockGroupFields,
  AppointmentBlockGroupValuesWithDays,
  AppointmentStaffSelection,
  FormButtonBar,
  FormSheet,
  validateAppointmentBlock,
  validateFieldArray,
} from "@eshg/lib-employee-portal";
import { OptionalFieldValue } from "@eshg/lib-portal";
import { ApiAppointmentType } from "@eshg/travel-medicine-api";

import { useAppointmentBlockApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { getValidateDailyAppointmentBlocksForGroupQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentBlocks";
import { mapFormValues } from "@/lib/businessModules/travelMedicine/components/appointmentBlocks/appointmentBlocksGroupForm/CreateAppointmentBlockGroupForm";
import { APPOINTMENT_TYPE_OPTIONS } from "@/lib/businessModules/travelMedicine/components/appointmentBlocks/options";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";

function validateForm(
  values: AppointmentBlockGroupValues,
  standardDurations: Partial<Record<ApiAppointmentType, number>>,
) {
  const errors: FormikErrors<AppointmentBlockGroupValues> = {};

  const appointmentBlockErrors = validateFieldArray(
    values.appointmentBlocks,
    (appointmentBlock) =>
      validateAppointmentBlock(
        values.types,
        appointmentBlock,
        standardDurations,
      ),
  );
  if (isDefined(appointmentBlockErrors)) {
    errors.appointmentBlocks = appointmentBlockErrors;
  }

  if (isEmpty(values.physicians) && isEmpty(values.mfas)) {
    const msg =
      "Es muss mindestens ein Arzt/eine Ärztin oder ein:e MFA ausgewählt sein.";
    errors.physicians = msg;
    errors.mfas = msg;
  }

  return errors;
}

interface AppointmentBlockGroupFormProps {
  initialValues: AppointmentBlockGroupValues;
  onSubmit: (values: AppointmentBlockGroupValues) => Promise<void>;
  standardDurations: Partial<Record<ApiAppointmentType, number>>;
  allMedicalAssistants: ApiUser[];
  allPhysicians: ApiUser[];
}

export interface AppointmentBlockGroupValues {
  types: ApiAppointmentType[];
  parallelExaminations: OptionalFieldValue<number>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  mfas: string[];
  physicians: string[];
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

  const medicalAssistantsOptions = props.allMedicalAssistants.map((option) => ({
    userId: option.userId,
    firstName: option.firstName,
    lastName: option.lastName,
  }));

  return (
    <Formik
      initialValues={props.initialValues}
      validate={(values) => validateForm(values, props.standardDurations)}
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
              medicalAssistantOptions={medicalAssistantsOptions}
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
