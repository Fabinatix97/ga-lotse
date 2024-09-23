/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/base";
import {
  ApiAppointmentType,
  ApiAppointmentTypeConfig,
  ApiLocationSelectionMode,
} from "@eshg/employee-portal-api/schoolEntry";
import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined, isEmpty, mapToObj } from "remeda";

import { AppointmentTypeConfig } from "@/lib/businessModules/schoolEntry/api/models/AppointmentTypeConfig";
import { APPOINTMENT_TYPE_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { AppointmentBlockGroupFields } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockGroupFields";
import {
  AppointmentCount,
  AppointmentValues,
} from "@/lib/shared/components/appointmentBlocks/AppointmentCount";
import { AppointmentLocationSelection } from "@/lib/shared/components/appointmentBlocks/AppointmentLocationSelection";
import { AppointmentStaffSelection } from "@/lib/shared/components/appointmentBlocks/AppointmentStaffSelection";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { FormSheet } from "@/lib/shared/components/form/FormSheet";
import { fullName } from "@/lib/shared/components/users/userFormatter";
import { validateFieldArray } from "@/lib/shared/helpers/validators";

import { validateAppointmentBlock } from "./validateAppointmentBlock";

function validateForm(
  values: AppointmentValues<ApiAppointmentType, ApiAppointmentTypeConfig>,
  appointmentTypes: AppointmentTypeConfig[],
) {
  const errors: FormikErrors<
    AppointmentValues<ApiAppointmentType, ApiAppointmentTypeConfig>
  > = {};
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
        values.type,
        appointmentBlock,
        examinationDurations,
      ),
  );
  if (isDefined(appointmentBlockErrors)) {
    errors.appointmentBlocks = appointmentBlockErrors;
  }

  if (isEmpty(values.physicians) && isEmpty(values.mfas)) {
    const msg =
      "Es muss mindestens ein:e Arzt:in oder ein:e MFA ausgewählt sein.";
    errors.physicians = msg;
    errors.mfas = msg;
  }

  return errors;
}

interface AppointmentBlockGroupFormProps {
  initialValues: AppointmentValues<
    ApiAppointmentType,
    ApiAppointmentTypeConfig
  >;
  onSubmit: (
    values: AppointmentValues<ApiAppointmentType, ApiAppointmentTypeConfig>,
  ) => Promise<void>;
  allAppointmentTypes: AppointmentTypeConfig[];
  allPhysicians: ApiUser[];
  allMfas: ApiUser[];
  blockedStaff: string[];
  freeStaff: string[];
  validateAvailability: (
    values: AppointmentValues<ApiAppointmentType, ApiAppointmentTypeConfig>,
  ) => void;
  locationSelectionMode: ApiLocationSelectionMode;
}

export function AppointmentBlockGroupForm(
  props: AppointmentBlockGroupFormProps,
) {
  const physicianOptions = props.allPhysicians.map((option) => ({
    value: option.userId,
    label: fullName(option),
  }));

  const medicalAssistantsOptions = props.allMfas.map((option) => ({
    value: option.userId,
    label: fullName(option),
  }));

  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      validate={(values) => validateForm(values, props.allAppointmentTypes)}
    >
      {({ values, isSubmitting, handleSubmit }) => (
        <FormSheet onSubmit={handleSubmit}>
          <Stack gap={3} divider={<Divider />}>
            <Stack gap={4}>
              <AppointmentBlockGroupFields
                appointmentBlocks={values.appointmentBlocks}
                options={APPOINTMENT_TYPE_OPTIONS}
                showParallelExaminations
                showAppointmentBlockFieldArrayWithDays={false}
              />
            </Stack>
            {props.locationSelectionMode !== ApiLocationSelectionMode.None && (
              <AppointmentLocationSelection
                contactCategory={props.locationSelectionMode}
              />
            )}
            <Stack gap={4}>
              <AppointmentStaffSelection
                physicianOptions={physicianOptions}
                medicalAssistantsOptions={medicalAssistantsOptions}
                freeStaff={props.freeStaff}
                blockedStaff={props.blockedStaff}
                validateAvailability={() => props.validateAvailability(values)}
              />
            </Stack>
            <FormButtonBar
              left={<AppointmentCount appointments={values} />}
              submitLabel="Planen"
              submitting={isSubmitting}
              onCancel={routes.appointmentBlockGroups.overview}
            />
          </Stack>
        </FormSheet>
      )}
    </Formik>
  );
}
