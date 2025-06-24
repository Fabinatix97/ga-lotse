/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined, isEmpty } from "remeda";

import { ApiUser } from "@eshg/base-api";
import {
  AppointmentStaffSelection,
  FormButtonBar,
  FormSheet,
  validateFieldArray,
} from "@eshg/lib-employee-portal";
import { OptionalFieldValue } from "@eshg/lib-portal";
import { ApiAppointmentType } from "@eshg/travel-medicine-api";

import { APPOINTMENT_TYPE_OPTIONS } from "@/lib/businessModules/travelMedicine/components/appointmentBlocks/options";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { AppointmentBlockGroupValuesWithDays } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import { AppointmentBlockGroupFields } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockGroupFields";
import { validateAppointmentBlock } from "@/lib/shared/components/appointmentBlocks/validateAppointmentBlock";
import { isArrayEqualIgnoringOrder } from "@/lib/shared/helpers/isArrayEqualIgnoringOrder";

function validateForm(
  values: AppointmentBlockGroupValues,
  allowedAppointmentTypeCombinations: ApiAppointmentType[][],
) {
  const errors: FormikErrors<AppointmentBlockGroupValues> = {};

  const appointmentBlockErrors = validateFieldArray(
    values.appointmentBlocks,
    (appointmentBlock) =>
      validateAppointmentBlock(
        values.types,
        appointmentBlock,
        values.allAppointmentTypes,
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

  if (
    values.types.length > 1 &&
    allowedAppointmentTypeCombinations.every(
      (combination) => !isArrayEqualIgnoringOrder(combination, values.types),
    )
  ) {
    errors.types = "Diese Kombination von Terminarten ist nicht erlaubt.";
  }

  return errors;
}

interface AppointmentBlockGroupFormProps {
  initialValues: AppointmentBlockGroupValues;
  allowedAppointmentTypeCombinations: ApiAppointmentType[][];
  onSubmit: (values: AppointmentBlockGroupValues) => Promise<void>;
  allMedicalAssistants: ApiUser[];
  allPhysicians: ApiUser[];
  blockedStaff: string[];
  freeStaff: string[];
  validateAvailability: (values: AppointmentBlockGroupValues) => void;
}

export interface AppointmentBlockGroupValues {
  types: ApiAppointmentType[];
  parallelExaminations: OptionalFieldValue<number>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  allAppointmentTypes: Record<string, number>;
  mfas: string[];
  physicians: string[];
}

export function AppointmentBlockGroupForm(
  props: Readonly<AppointmentBlockGroupFormProps>,
) {
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
      validate={(values) =>
        validateForm(values, props.allowedAppointmentTypeCombinations)
      }
      onSubmit={props.onSubmit}
    >
      {({ values, isSubmitting, handleSubmit }) => (
        <FormSheet gap={5} onSubmit={handleSubmit}>
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
              freeStaff={props.freeStaff}
              blockedStaff={props.blockedStaff}
              validateAvailability={() => props.validateAvailability(values)}
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
