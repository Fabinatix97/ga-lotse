/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Grid, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined, isEmpty } from "remeda";

import {
  AppointmentBlockGroupFields,
  AppointmentBlockGroupValuesWithDays,
  AppointmentRoomField,
  AppointmentStaffSelection,
  AppointmentStandardDurations,
  FormButtonBar,
  FormSheet,
  NamedUser,
  validateAppointmentBlock,
  validateFieldArray,
} from "@eshg/lib-employee-portal";
import { OptionalFieldValue } from "@eshg/lib-portal";
import { ApiAppointmentType, ApiUser } from "@eshg/sti-protection-api";

import { appointmentBlockApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";
import { useAppointmentBlockApi } from "@/lib/businessModules/stiProtection/api/clients";
import { mapAppointmentBlockApi } from "@/lib/businessModules/stiProtection/api/mapAppointmentBlockApi";
import { getValidateDailyAppointmentBlocksForGroupQuery } from "@/lib/businessModules/stiProtection/api/queries/appointmentBlocks";
import { mapFormValues } from "@/lib/businessModules/stiProtection/components/appointmentBlocks/CreateAppointmentBlockGroupForm";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";

import { APPOINTMENT_TYPE_OPTIONS } from "./options";

export interface AppointmentBlockGroupValues {
  types: ApiAppointmentType[];
  parallelExaminations: OptionalFieldValue<number>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  consultants: string[];
  physicians: string[];
  locationId: OptionalFieldValue<string>;
  room: string;
}

export interface StiProtectionAppointmentValues {
  types: ApiAppointmentType[];
  parallelExaminations: OptionalFieldValue<number>;
  physicians: string[];
  mfas?: string[];
  locationId: OptionalFieldValue<string>;
  room: string;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  consultants: string[];
}

function validateForm(
  values: StiProtectionAppointmentValues,
  standardDurations: AppointmentStandardDurations,
) {
  const errors: FormikErrors<StiProtectionAppointmentValues> = {};

  const appointmentBlockErrors = validateFieldArray(
    values.appointmentBlocks,
    (appointmentBlock) =>
      validateAppointmentBlock(
        values.types,
        false,
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
  standardDurations: AppointmentStandardDurations;
  initialValues: StiProtectionAppointmentValues;
  consultants: ApiUser[];
  physicians: ApiUser[];
}

export function AppointmentBlockGroupForm({
  onSubmit,
  initialValues,
  consultants = [],
  physicians = [],
  standardDurations,
}: Readonly<AppointmentBlockGroupFormProps>) {
  const appointmentBlockApi = useAppointmentBlockApi();

  const physicianOptions = physicians.map(userToOption);
  const consultantOptions = consultants.map(userToOption);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => validateForm(values, standardDurations)}
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting, handleSubmit }) => (
        <FormSheet gap={5} aria-label="Terminblock" onSubmit={handleSubmit}>
          <Stack gap={4}>
            <AppointmentBlockGroupFields
              appointmentBlocksWithDays={values.appointmentBlocks}
              options={APPOINTMENT_TYPE_OPTIONS}
            />
          </Stack>
          <Stack gap={4}>
            <AppointmentStaffSelection
              consultantOptions={consultantOptions}
              physicianOptions={physicianOptions}
              validateAppointmentBlocks={() => mapFormValues(values)}
              getCheckAvailabilityQuery={() =>
                getValidateDailyAppointmentBlocksForGroupQuery(
                  appointmentBlockApi,
                  mapFormValues(values),
                )
              }
            />
          </Stack>
          <Grid container>
            <Grid xs={6}>
              <AppointmentRoomField
                appointmentBlockApi={mapAppointmentBlockApi(
                  appointmentBlockApi,
                )}
                queryKey={appointmentBlockApiQueryKey}
              />
            </Grid>
          </Grid>
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
