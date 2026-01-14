/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Grid, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined, isEmpty } from "remeda";

import { ApiUser } from "@eshg/base-api";
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
import { OptionalFieldValue } from "@eshg/lib-portal";
import { ApiAppointmentType } from "@eshg/prostitute-protection-api";

import { mapAppointmentBlockApi } from "../../api/mapAppointmentBlockApi";
import { appointmentBlockApiQueryKey } from "../../api/queries/apiQueryKeys";
import { getValidateDailyAppointmentBlocksForGroupQuery } from "../../api/queries/appointmentBlockApi";
import { routes } from "../../config/routes";
import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";

import { mapFormValues } from "./ProstituteProtectionCreateAppointmentBlockGroupForm";
import { APPOINTMENT_TYPE_OPTIONS } from "./options";

export interface ProstituteProtectionAppointmentValues {
  types: ApiAppointmentType[];
  room: OptionalFieldValue<string>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  consultants: string[];
}

function validateForm(
  values: ProstituteProtectionAppointmentValues,
  standardDurations: AppointmentStandardDurations,
) {
  const errors: FormikErrors<ProstituteProtectionAppointmentValues> = {};
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
  onSubmit: (values: ProstituteProtectionAppointmentValues) => Promise<void>;
  standardDurations: AppointmentStandardDurations;
  initialValues: ProstituteProtectionAppointmentValues;
  allConsultants: ApiUser[];
}

export function AppointmentBlockGroupForm({
  onSubmit,
  standardDurations,
  initialValues,
  allConsultants,
}: Readonly<AppointmentBlockGroupFormProps>) {
  const { appointmentBlockApi } = useProstituteProtectionApiClients();
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
