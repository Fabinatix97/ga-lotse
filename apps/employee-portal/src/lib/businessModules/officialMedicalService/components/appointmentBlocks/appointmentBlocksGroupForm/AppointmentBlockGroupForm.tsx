/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined } from "remeda";

import { ApiUser } from "@eshg/base-api";
import {
  AppointmentStaffSelection,
  FormButtonBar,
  FormSheet,
  validateFieldArray,
} from "@eshg/lib-employee-portal";
import { ApiAppointmentType } from "@eshg/official-medical-service-api";

import { AppointmentTypeConfig } from "@/lib/businessModules/officialMedicalService/api/models/AppointmentTypeConfig";
import { CreateAppointmentBlockGroupValues } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/appointmentBlocksGroupForm/CreateAppointmentBlockGroupForm";
import { APPOINTMENT_TYPE_OPTIONS } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/options";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { AppointmentBlockGroupFields } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockGroupFields";
import { validateAppointmentBlock } from "@/lib/shared/components/appointmentBlocks/validateAppointmentBlock";
import { isArrayEqualIgnoringOrder } from "@/lib/shared/helpers/isArrayEqualIgnoringOrder";

function validateForm(
  values: CreateAppointmentBlockGroupValues,
  appointmentDurations: Record<string, number>,
  allowedAppointmentTypeCombinations: ApiAppointmentType[][],
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
  initialValues: CreateAppointmentBlockGroupValues;
  allowedAppointmentTypeCombinations: ApiAppointmentType[][];
  onSubmit: (values: CreateAppointmentBlockGroupValues) => Promise<void>;
  allPhysicians: ApiUser[];
  allAppointmentTypes: AppointmentTypeConfig[];
  blockedStaff: string[];
  freeStaff: string[];
  validateAvailability: (values: CreateAppointmentBlockGroupValues) => void;
}

export function AppointmentBlockGroupForm(
  props: Readonly<AppointmentBlockGroupFormProps>,
) {
  const physicianOptions = props.allPhysicians.map((option) => ({
    userId: option.userId,
    firstName: option.firstName,
    lastName: option.lastName,
  }));
  const appointmentTypesRecord: Record<string, number> = {};
  props.allAppointmentTypes.forEach(
    (currentType) =>
      (appointmentTypesRecord[currentType.appointmentTypeDto] =
        currentType.standardDurationInMinutes),
  );
  return (
    <Formik
      initialValues={props.initialValues}
      validate={(values) =>
        validateForm(
          values,
          appointmentTypesRecord,
          props.allowedAppointmentTypeCombinations,
        )
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
              physicianRequired="Es muss mindestens ein Arzt/eine Ärztin ausgewählt sein."
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
