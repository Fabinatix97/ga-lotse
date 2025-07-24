/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined, isEmpty, mapToObj } from "remeda";

import { ApiUser } from "@eshg/base-api";
import {
  AppointmentStaffSelection,
  FormButtonBar,
  FormSheet,
  validateFieldArray,
} from "@eshg/lib-employee-portal";
import { ApiLocationSelectionMode } from "@eshg/school-entry-api";

import { AppointmentTypeConfig } from "@/lib/businessModules/schoolEntry/api/models/AppointmentTypeConfig";
import { CreateAppointmentBlockGroupValues } from "@/lib/businessModules/schoolEntry/features/appointmentBlocks/appointmentBlocksGroupForm/CreateAppointmentBlockGroupForm";
import { APPOINTMENT_TYPE_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { AppointmentBlockGroupFields } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockGroupFields";
import { AppointmentLocationSelection } from "@/lib/shared/components/appointmentBlocks/AppointmentLocationSelection";
import { validateAppointmentBlock } from "@/lib/shared/components/appointmentBlocks/validateAppointmentBlock";

function validateForm(
  values: CreateAppointmentBlockGroupValues,
  appointmentTypes: AppointmentTypeConfig[],
) {
  const errors: FormikErrors<CreateAppointmentBlockGroupValues> = {};
  const examinationDurations = mapToObj(
    appointmentTypes,
    (appointmentTypeConfig) => [
      appointmentTypeConfig.appointmentTypeDto,
      appointmentTypeConfig.standardDurationInMinutes,
    ],
  );
  const appointmentBlockErrors = validateFieldArray(
    values.appointmentBlocks,
    (appointmentBlock) =>
      validateAppointmentBlock(
        values.types,
        appointmentBlock,
        examinationDurations,
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
  initialValues: CreateAppointmentBlockGroupValues;
  onSubmit: (values: CreateAppointmentBlockGroupValues) => Promise<void>;
  allAppointmentTypes: AppointmentTypeConfig[];
  allPhysicians: ApiUser[];
  allMfas: ApiUser[];
  blockedStaff: string[];
  freeStaff: string[];
  validateAvailability: (values: CreateAppointmentBlockGroupValues) => void;
  locationSelectionMode: ApiLocationSelectionMode;
}

export function AppointmentBlockGroupForm(
  props: Readonly<AppointmentBlockGroupFormProps>,
) {
  const physicianOptions = props.allPhysicians.map((option) => ({
    userId: option.userId,
    firstName: option.firstName,
    lastName: option.lastName,
  }));

  const medicalAssistantsOptions = props.allMfas.map((option) => ({
    userId: option.userId,
    firstName: option.firstName,
    lastName: option.lastName,
  }));

  return (
    <Formik
      initialValues={props.initialValues}
      validate={(values) => validateForm(values, props.allAppointmentTypes)}
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
          {props.locationSelectionMode !== ApiLocationSelectionMode.None && (
            <AppointmentLocationSelection
              contactCategory={props.locationSelectionMode}
            />
          )}
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
            onCancel={routes.appointments.overview}
          />
        </FormSheet>
      )}
    </Formik>
  );
}
