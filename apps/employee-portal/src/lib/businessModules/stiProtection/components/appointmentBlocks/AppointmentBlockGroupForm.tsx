/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined, isEmpty } from "remeda";

import {
  AppointmentBlockGroupFields,
  AppointmentBlockGroupValuesWithDays,
  AppointmentStaffSelection,
  FormButtonBar,
  FormSheet,
  NamedUser,
  validateAppointmentBlock,
  validateFieldArray,
} from "@eshg/lib-employee-portal";
import { OptionalFieldValue } from "@eshg/lib-portal";
import { ApiAppointmentType, ApiUser } from "@eshg/sti-protection-api";

import { routes } from "@/lib/businessModules/stiProtection/shared/routes";

import { APPOINTMENT_TYPE_OPTIONS } from "./options";

export interface AppointmentBlockGroupValues {
  types: ApiAppointmentType[];
  parallelExaminations: OptionalFieldValue<number>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  consultants: string[];
  physicians: string[];
  locationId: OptionalFieldValue<string>;
}

export interface StiProtectionAppointmentValues {
  types: ApiAppointmentType[];
  parallelExaminations: OptionalFieldValue<number>;
  physicians: string[];
  mfas?: string[];
  locationId: OptionalFieldValue<string>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  consultants: string[];
}

function validateForm(
  values: StiProtectionAppointmentValues,
  standardDurations: Partial<Record<ApiAppointmentType, number>>,
) {
  const errors: FormikErrors<StiProtectionAppointmentValues> = {};

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

  if (isEmpty(values.physicians) && isEmpty(values.consultants)) {
    const msg =
      "Es muss mindestens ein Arzt/eine Ärztin oder ein:e Berater:in ausgewählt sein.";
    errors.physicians = msg;
    errors.consultants = msg;
  }

  return errors;
}

function userToOption(user: ApiUser): NamedUser {
  return {
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

interface AppointmentBlockGroupFormProps {
  onSubmit: (values: AppointmentBlockGroupValues) => Promise<void>;
  validateAvailability: (values: StiProtectionAppointmentValues) => void;
  standardDurations: Partial<Record<ApiAppointmentType, number>>;
  blockedStaff: string[];
  freeStaff: string[];
  initialValues: StiProtectionAppointmentValues;
  consultants: ApiUser[];
  physicians: ApiUser[];
}

export function AppointmentBlockGroupForm({
  onSubmit,
  validateAvailability,
  blockedStaff,
  freeStaff,
  initialValues,
  consultants = [],
  physicians = [],
  standardDurations,
}: Readonly<AppointmentBlockGroupFormProps>) {
  const physicianOptions = physicians.map(userToOption);
  const consultantOptions = consultants.map(userToOption);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => validateForm(values, standardDurations)}
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting, handleSubmit }) => (
        <FormSheet gap={5} onSubmit={handleSubmit}>
          <Stack gap={4}>
            <AppointmentBlockGroupFields
              appointmentBlocksWithDays={values.appointmentBlocks}
              options={APPOINTMENT_TYPE_OPTIONS}
            />
          </Stack>
          <Stack gap={4}>
            <AppointmentStaffSelection
              blockedStaff={blockedStaff}
              freeStaff={freeStaff}
              consultantOptions={consultantOptions}
              physicianOptions={physicianOptions}
              validateAvailability={() => validateAvailability(values)}
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
