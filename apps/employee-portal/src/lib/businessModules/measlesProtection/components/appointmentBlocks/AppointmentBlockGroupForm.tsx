/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined } from "remeda";

import {
  FormButtonBar,
  FormSheet,
  validateFieldArray,
} from "@eshg/lib-employee-portal";

import { AppointmentDurationsMeasles } from "@/lib/businessModules/measlesProtection/api/models/AppointmentBlockGroup";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { AppointmentBlockGroupFields } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockGroupFields";
import { AppointmentBlockGroupValues } from "@/lib/shared/components/appointmentBlocks/calculateAppointmentCount";
import { validateAppointmentBlock } from "@/lib/shared/components/appointmentBlocks/validateAppointmentBlock";

import { APPOINTMENT_TYPE_OPTIONS } from "./options";

function validateForm(
  values: AppointmentBlockGroupValues,
  appointmentDurationsMeasles: AppointmentDurationsMeasles,
) {
  const errors: FormikErrors<AppointmentBlockGroupValues> = {};
  const appointmentBlockErrors = validateFieldArray(
    values.appointmentBlocks,
    (appointmentBlock) =>
      validateAppointmentBlock(
        values.types,
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
  appointmentDurationsMeasles: AppointmentDurationsMeasles;
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
        <FormSheet gap={5} onSubmit={handleSubmit}>
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
