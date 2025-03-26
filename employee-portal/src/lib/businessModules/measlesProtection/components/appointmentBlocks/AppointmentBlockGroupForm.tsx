/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormButtonBar } from "@eshg/lib-employee-portal";
import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined } from "remeda";

import { AppointmentDurationsMeasles } from "@/lib/businessModules/measlesProtection/api/models/AppointmentBlockGroup";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { AppointmentBlockGroupFields } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockGroupFields";
import {
  AppointmentBlockGroupValues,
  AppointmentCountWithDays,
} from "@/lib/shared/components/appointmentBlocks/AppointmentCountWithDays";
import { validateAppointmentBlock } from "@/lib/shared/components/appointmentBlocks/validateAppointmentBlock";
import { FormSheet } from "@/lib/shared/components/form/FormSheet";
import { validateFieldArray } from "@/lib/shared/helpers/validators";

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
        values.type,
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
      onSubmit={props.onSubmit}
      validate={(values) =>
        validateForm(values, props.appointmentDurationsMeasles)
      }
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
            left={
              <AppointmentCountWithDays
                appointments={values}
                appointmentDurations={props.appointmentDurationsMeasles}
                parallelExaminations={1}
              />
            }
            submitLabel="Planen"
            submitting={isSubmitting}
            onCancel={routes.appointmentBlockGroups.index}
          />
        </FormSheet>
      )}
    </Formik>
  );
}
