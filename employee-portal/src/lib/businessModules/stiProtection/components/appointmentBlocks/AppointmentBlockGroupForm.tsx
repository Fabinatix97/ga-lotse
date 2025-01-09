/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiAppointmentTypeConfig,
  ApiUser,
} from "@eshg/employee-portal-api/stiProtection";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined, isEmpty, mapToObj } from "remeda";

import { AppointmentTypeConfig } from "@/lib/businessModules/stiProtection/api/models/AppointmentTypeConfig";
import { useCreateDailyAppointmentBlocksForGroupOptions } from "@/lib/businessModules/stiProtection/api/mutations/appointmentBlocks";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { AppointmentBlockGroupValuesWithDays } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import { AppointmentBlockGroupFields } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockGroupFields";
import { AppointmentCountWithDays } from "@/lib/shared/components/appointmentBlocks/AppointmentCountWithDays";
import { AppointmentStaffSelection } from "@/lib/shared/components/appointmentBlocks/AppointmentStaffSelection";
import { validateAppointmentBlock } from "@/lib/shared/components/appointmentBlocks/validateAppointmentBlock";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { FormSheet } from "@/lib/shared/components/form/FormSheet";
import { fullName } from "@/lib/shared/components/users/userFormatter";
import { validateFieldArray } from "@/lib/shared/helpers/validators";

import { mapFormValues } from "./CreateAppointmentBlockGroupForm";
import { APPOINTMENT_TYPE_OPTIONS } from "./options";

export interface AppointmentBlockGroupValues {
  type: OptionalFieldValue<ApiAppointmentType>;
  parallelExaminations: OptionalFieldValue<number>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  allAppointmentTypes: AppointmentTypeConfig[];
  consultants: string[];
  physicians: string[];
  locationId: OptionalFieldValue<string>;
}

export interface StiProtectionAppointmentValues {
  type: OptionalFieldValue<ApiAppointmentType>;
  parallelExaminations: OptionalFieldValue<number>;
  allAppointmentTypes: ApiAppointmentTypeConfig[];
  physicians: string[];
  mfas?: string[];
  locationId: OptionalFieldValue<string>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  consultants: string[];
}

function validateForm(
  values: StiProtectionAppointmentValues,
  appointmentTypes: AppointmentTypeConfig[],
) {
  const errors: FormikErrors<StiProtectionAppointmentValues> = {};
  const appointmentDurations = mapToObj(
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
        appointmentDurations,
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

function userToOption(user: ApiUser): SelectOption {
  return {
    value: user.userId,
    label: fullName(user),
  };
}

interface AppointmentBlockGroupFormProps {
  onSubmit: (values: AppointmentBlockGroupValues) => Promise<void>;
  validateAvailability: (values: StiProtectionAppointmentValues) => void;
  appointmentTypes: AppointmentTypeConfig[];
  blockedStaff: string[];
  freeStaff: string[];
  initialValues: StiProtectionAppointmentValues;
  consultants: ApiUser[];
  physicians: ApiUser[];
}

export function AppointmentBlockGroupForm({
  onSubmit,
  validateAvailability,
  appointmentTypes,
  blockedStaff,
  freeStaff,
  initialValues,
  consultants = [],
  physicians = [],
}: Readonly<AppointmentBlockGroupFormProps>) {
  const createDailyAppointmentBlocksForGroupOptions =
    useCreateDailyAppointmentBlocksForGroupOptions();

  const physicianOptions = physicians.map(userToOption);
  const consultantOptions = consultants.map(userToOption);
  const appointmentDurations = Object.fromEntries(
    appointmentTypes.map((currentType) => [
      currentType.appointmentTypeDto,
      currentType.standardDurationInMinutes,
    ]),
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={(values) => validateForm(values, appointmentTypes)}
    >
      {({ values, isSubmitting, handleSubmit }) => (
        <FormSheet gap={5} onSubmit={handleSubmit}>
          <ConfirmLeaveDirtyFormEffect
            onSaveMutation={{
              mutationOptions: createDailyAppointmentBlocksForGroupOptions,
              variableSupplier: () => mapFormValues(values),
            }}
          />
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
            left={
              <AppointmentCountWithDays
                appointments={values}
                appointmentDurations={appointmentDurations}
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
