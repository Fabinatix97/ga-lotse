/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined } from "remeda";

import {
  AppointmentBlockGroupFields,
  AppointmentBlockGroupValues,
  AppointmentStandardDurations,
  FormButtonBar,
  FormSheet,
  validateAppointmentBlock,
  validateFieldArray,
} from "@eshg/lib-employee-portal";

import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";

import { APPOINTMENT_TYPE_OPTIONS } from "./options";

function validateForm(
  values: AppointmentBlockGroupValues,
  appointmentDurationsMeasles: AppointmentStandardDurations,
) {
  const errors: FormikErrors<AppointmentBlockGroupValues> = {};
  const appointmentBlockErrors = validateFieldArray(
    values.appointmentBlocks,
    (appointmentBlock) =>
      validateAppointmentBlock(
        values.types,
        false,
        appointmentBlock,
        appointmentDurationsMeasles,
      ),
  );
  if (isDefined(appointmentBlockErrors)) {
    errors.appointmentBlocks = appointmentBlockErrors;
  }

  return errors;
}

interface AppointmentBlockGroupFormProps {
  initialValues: AppointmentBlockGroupValues;
  onSubmit: (values: AppointmentBlockGroupValues) => Promise<void>;
  appointmentDurationsMeasles: AppointmentStandardDurations;
}

export function AppointmentBlockGroupForm(
  props: Readonly<AppointmentBlockGroupFormProps>,
) {
  return (
    <Formik
      initialValues={props.initialValues}
      validate={(values) =>
        validateForm(values, props.appointmentDurationsMeasles)
      }
      onSubmit={props.onSubmit}
    >
      {({ values, isSubmitting, handleSubmit }) => (
        <FormSheet gap={5} aria-label="Terminblock" onSubmit={handleSubmit}>
          <Stack gap={5}>
            <AppointmentBlockGroupFields
              appointmentBlocksWithDays={values.appointmentBlocks}
              options={APPOINTMENT_TYPE_OPTIONS}
              showParallelExaminations={false}
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
