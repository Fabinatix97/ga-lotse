/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined } from "remeda";

import { ApiUser } from "@eshg/base-api";
import { FormButtonBar, FormSheet } from "@eshg/lib-employee-portal";
import { isEmptyString, useSnackbar } from "@eshg/lib-portal";

import { AppointmentTypeConfig } from "@/lib/businessModules/officialMedicalService/api/models/AppointmentTypeConfig";
import { CreateAppointmentBlockGroupValues } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/appointmentBlocksGroupForm/CreateAppointmentBlockGroupForm";
import { APPOINTMENT_TYPE_OPTIONS } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/options";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { AppointmentBlockGroupFields } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockGroupFields";
import {
  AppointmentCountWithDays,
  calculateAppointmentCount,
} from "@/lib/shared/components/appointmentBlocks/AppointmentCountWithDays";
import { AppointmentStaffSelection } from "@/lib/shared/components/appointmentBlocks/AppointmentStaffSelection";
import { validateAppointmentBlock } from "@/lib/shared/components/appointmentBlocks/validateAppointmentBlock";
import { validateFieldArray } from "@/lib/shared/helpers/validators";

const DEFAULT_PARALLEL_EXAMINATIONS = 1;

function validateForm(
  values: CreateAppointmentBlockGroupValues,
  appointmentDurations: Record<string, number>,
) {
  const errors: FormikErrors<CreateAppointmentBlockGroupValues> = {};

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

  return errors;
}

function hasAtLeastOneAppointmentInGroup(
  values: CreateAppointmentBlockGroupValues,
  appointmentDurations: Record<string, number>,
) {
  return (
    calculateAppointmentCount({
      ...values,
      appointmentDurations: appointmentDurations,
      parallelExaminations: isEmptyString(values.parallelExaminations)
        ? DEFAULT_PARALLEL_EXAMINATIONS
        : Math.max(values.parallelExaminations, DEFAULT_PARALLEL_EXAMINATIONS),
      skipCalculatingOfBlocks:
        validateForm(values, appointmentDurations).appointmentBlocks !=
        undefined,
    }) > 0
  );
}

interface AppointmentBlockGroupFormProps {
  initialValues: CreateAppointmentBlockGroupValues;
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
  const snackbar = useSnackbar();
  const physicianOptions = props.allPhysicians.map((option) => ({
    userId: option.userId,
    firstName: option.firstName,
    lastName: option.lastName,
  }));
  const appointmentDurations = Object.fromEntries(
    props.allAppointmentTypes.map((currentType) => [
      currentType.appointmentTypeDto,
      currentType.standardDurationInMinutes,
    ]),
  );
  const appointmentTypesRecord: Record<string, number> = {};
  props.allAppointmentTypes.forEach(
    (currentType) =>
      (appointmentTypesRecord[currentType.appointmentTypeDto] =
        currentType.standardDurationInMinutes),
  );
  return (
    <Formik
      initialValues={props.initialValues}
      validate={(values) => validateForm(values, appointmentTypesRecord)}
      onSubmit={async (values) => {
        if (hasAtLeastOneAppointmentInGroup(values, appointmentTypesRecord)) {
          await props.onSubmit(values);
        } else {
          snackbar.notification(
            "Es muss mindestens ein Termin enthalten sein.",
          );
        }
      }}
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
            left={
              <AppointmentCountWithDays
                appointments={values}
                appointmentDurations={appointmentDurations}
                parallelExaminations={
                  isEmptyString(values.parallelExaminations)
                    ? DEFAULT_PARALLEL_EXAMINATIONS
                    : Math.max(
                        values.parallelExaminations,
                        DEFAULT_PARALLEL_EXAMINATIONS,
                      )
                }
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
