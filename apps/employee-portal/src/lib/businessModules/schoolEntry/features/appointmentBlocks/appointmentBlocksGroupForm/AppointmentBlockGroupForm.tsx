/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Grid, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined, isEmpty } from "remeda";

import { ApiUser } from "@eshg/base-api";
import {
  AppointmentBlockGroupFields,
  AppointmentLocationSelection,
  AppointmentRoomField,
  AppointmentStaffSelection,
  AppointmentStandardDurations,
  FormButtonBar,
  FormSheet,
  validateAppointmentBlock,
  validateFieldArray,
} from "@eshg/lib-employee-portal";
import { CheckboxField } from "@eshg/lib-portal";
import { ApiLocationSelectionMode } from "@eshg/school-entry-api";

import { useAppointmentBlockApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { mapAppointmentBlockApi } from "@/lib/businessModules/schoolEntry/api/mapAppointmentBlockApi";
import { appointmentBlockApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";
import { getValidateDailyAppointmentBlocksForGroupQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockApi";
import {
  CreateAppointmentBlockGroupValues,
  mapFormValues,
} from "@/lib/businessModules/schoolEntry/features/appointmentBlocks/appointmentBlocksGroupForm/CreateAppointmentBlockGroupForm";
import { APPOINTMENT_TYPE_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

function validateForm(
  values: CreateAppointmentBlockGroupValues,
  standardDurations: AppointmentStandardDurations,
) {
  const errors: FormikErrors<CreateAppointmentBlockGroupValues> = {};

  const appointmentBlockErrors = validateFieldArray(
    values.appointmentBlocks,
    (appointmentBlock) =>
      validateAppointmentBlock(
        values.types,
        values.extraLength,
        appointmentBlock,
        standardDurations,
      ),
  );
  if (isDefined(appointmentBlockErrors)) {
    errors.appointmentBlocks = appointmentBlockErrors;
  }

  if (values.extraLength) {
    if (isEmpty(values.sopasss)) {
      errors.sopasss =
        "Es muss mindestens ein ein:e SOPASS qualifizierte:r MFA ausgewählt sein.";
    }
  } else {
    if (isEmpty(values.physicians) && isEmpty(values.mfas)) {
      const msg =
        "Es muss mindestens ein Arzt/eine Ärztin oder ein:e MFA ausgewählt sein.";
      errors.physicians = msg;
      errors.mfas = msg;
    }
  }

  return errors;
}

interface AppointmentBlockGroupFormProps {
  initialValues: CreateAppointmentBlockGroupValues;
  onSubmit: (values: CreateAppointmentBlockGroupValues) => Promise<void>;
  standardDurations: AppointmentStandardDurations;
  allPhysicians: ApiUser[];
  allMfas: ApiUser[];
  allSopasss: ApiUser[];
  locationSelectionMode: ApiLocationSelectionMode;
}

export function AppointmentBlockGroupForm(
  props: Readonly<AppointmentBlockGroupFormProps>,
) {
  const appointmentBlockApi = useAppointmentBlockApi();

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

  const sopassOptions = props.allSopasss.map((option) => ({
    userId: option.userId,
    firstName: option.firstName,
    lastName: option.lastName,
  }));

  return (
    <Formik
      initialValues={props.initialValues}
      validate={(values) => validateForm(values, props.standardDurations)}
      onSubmit={props.onSubmit}
    >
      {({ values, isSubmitting, handleSubmit }) => (
        <FormSheet gap={5} aria-label="Terminblock" onSubmit={handleSubmit}>
          <Stack gap={5}>
            <AppointmentBlockGroupFields
              appointmentBlocksWithDays={values.appointmentBlocks}
              options={APPOINTMENT_TYPE_OPTIONS}
              showParallelExaminations
            />
          </Stack>
          <Stack
            gap={3}
            direction="row"
            role="group"
            aria-label="Terminblockverfügbarkeit"
          >
            Verfügbar für
            <CheckboxField name="availableForCitizen" label="Online-Portal" />
            <CheckboxField
              name="availableForBulkBooking"
              label="Massenterminzuweisung"
            />
          </Stack>
          {props.locationSelectionMode !== ApiLocationSelectionMode.None && (
            <AppointmentLocationSelection
              contactCategory={props.locationSelectionMode}
            />
          )}
          <Stack gap={5}>
            <AppointmentStaffSelection
              physicianOptions={
                values.extraLength ? undefined : physicianOptions
              }
              medicalAssistantOptions={
                values.extraLength ? undefined : medicalAssistantsOptions
              }
              sopassOptions={values.extraLength ? sopassOptions : undefined}
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
            submitAriaLabel="Terminblock planen"
            submitting={isSubmitting}
            onCancel={routes.appointments.overview}
          />
        </FormSheet>
      )}
    </Formik>
  );
}
