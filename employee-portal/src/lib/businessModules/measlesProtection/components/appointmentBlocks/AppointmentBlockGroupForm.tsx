/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentType } from "@eshg/employee-portal-api/measlesProtection";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined } from "remeda";

import { AppointmentDurationsMeasles } from "@/lib/businessModules/measlesProtection/api/models/AppointmentBlockGroup";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { AppointmentBlockGroupValuesWithDays } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import { AppointmentBlockGroupFields } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockGroupFields";
import { AppointmentCountWithDays } from "@/lib/shared/components/appointmentBlocks/AppointmentCountWithDays";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { FormSheet } from "@/lib/shared/components/form/FormSheet";
import { validateFieldArray } from "@/lib/shared/helpers/validators";

import { validateAppointmentBlock } from "./ValidateAppointmentBlock";
import { APPOINTMENT_TYPE_OPTIONS } from "./options";

export interface AppointmentBlockGroupValues {
  type: OptionalFieldValue<ApiAppointmentType>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
}

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
        <FormSheet onSubmit={handleSubmit}>
          <Stack gap={4}>
            <AppointmentBlockGroupFields
              appointmentBlocksWithDays={values.appointmentBlocks}
              options={APPOINTMENT_TYPE_OPTIONS}
              showParallelExaminations={false}
              showAppointmentBlockFieldArrayWithDays
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
