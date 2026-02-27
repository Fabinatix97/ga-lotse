/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Grid, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined, isEmpty } from "remeda";

import { ApiUser } from "@eshg/base-api";
import { ApiAppointmentType } from "@eshg/infection-briefing-api";
import {
  AppointmentBlockGroupFields,
  AppointmentBlockGroupValuesWithDays,
  AppointmentRoomField,
  AppointmentStaffSelection,
  AppointmentStandardDurations,
  FormButtonBar,
  FormSheet,
  validateAppointmentBlock,
  validateFieldArray,
} from "@eshg/lib-employee-portal";
import { CheckboxField, OptionalFieldValue } from "@eshg/lib-portal";

import { mapAppointmentBlockApi } from "../../api/mapAppointmentBlockApi";
import { appointmentBlockApiQueryKey } from "../../api/queries/apiQueryKeys";
import { getValidateDailyAppointmentBlocksForGroupQuery } from "../../api/queries/appointmentBlockApi";
import { routes } from "../../config/routes";
import { useInfectionBriefingApiClients } from "../../contexts/InfectionBriefingApi";

import { mapFormValues } from "./InfectionBriefingCreateAppointmentBlockGroupForm";
import { APPOINTMENT_TYPE_OPTIONS } from "./options";

export interface InfectionBriefingAppointmentValues {
  types: ApiAppointmentType[];
  room: OptionalFieldValue<string>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  consultants: string[];
  availableForCitizen: boolean;
}

function validateForm(
  values: InfectionBriefingAppointmentValues,
  standardDurations: AppointmentStandardDurations,
) {
  const errors: FormikErrors<InfectionBriefingAppointmentValues> = {};
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

  if (isEmpty(values.consultants)) {
    errors.consultants = "Es muss mindestens ein:e Berater:in ausgewählt sein.";
  }
  return errors;
}

interface AppointmentBlockGroupFormProps {
  onSubmit: (values: InfectionBriefingAppointmentValues) => Promise<void>;
  standardDurations: AppointmentStandardDurations;
  initialValues: InfectionBriefingAppointmentValues;
  allConsultants: ApiUser[];
}

export function AppointmentBlockGroupForm({
  onSubmit,
  standardDurations,
  initialValues,
  allConsultants,
}: Readonly<AppointmentBlockGroupFormProps>) {
  const { appointmentBlockApi } = useInfectionBriefingApiClients();
  const consultantOptions = allConsultants.map((option) => ({
    userId: option.userId,
    firstName: option.firstName,
    lastName: option.lastName,
  }));

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
          <Stack
            gap={3}
            direction="row"
            role="group"
            aria-label="Terminblockverfügbarkeit"
          >
            Verfügbar für
            <CheckboxField name="availableForCitizen" label="Online-Portal" />
          </Stack>
          <Stack>
            <AppointmentStaffSelection
              consultantOptions={consultantOptions}
              consultantRequired="Es muss mindestens eine:n Berater:in ausgewählt sein."
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
