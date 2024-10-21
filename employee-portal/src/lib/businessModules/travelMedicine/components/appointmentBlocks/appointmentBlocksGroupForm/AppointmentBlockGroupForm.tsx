/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/base";
import { ApiAppointmentType } from "@eshg/employee-portal-api/travelMedicine";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined, isEmpty } from "remeda";

import { APPOINTMENT_TYPE_OPTIONS } from "@/lib/businessModules/travelMedicine/components/appointmentBlocks/options";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { AppointmentBlockGroupValuesWithDays } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import { AppointmentBlockGroupFields } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockGroupFields";
import {
  AppointmentCountWithDays,
  calculateAppointmentCount,
} from "@/lib/shared/components/appointmentBlocks/AppointmentCountWithDays";
import { AppointmentStaffSelection } from "@/lib/shared/components/appointmentBlocks/AppointmentStaffSelection";
import { validateAppointmentBlock } from "@/lib/shared/components/appointmentBlocks/validateAppointmentBlock";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { FormSheet } from "@/lib/shared/components/form/FormSheet";
import { fullName } from "@/lib/shared/components/users/userFormatter";
import { validateFieldArray } from "@/lib/shared/helpers/validators";

const DEFAULT_PARALLEL_EXAMINATIONS = 1;

function validateForm(values: AppointmentBlockGroupValues) {
  const errors: FormikErrors<AppointmentBlockGroupValues> = {};

  const appointmentBlockErrors = validateFieldArray(
    values.appointmentBlocks,
    (appointmentBlock) =>
      validateAppointmentBlock(
        values.type,
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

  return errors;
}

function hasAtLeastOneAppointmentInGroup(values: AppointmentBlockGroupValues) {
  return (
    calculateAppointmentCount({
      ...values,
      appointmentDurations: values.allAppointmentTypes,
      parallelExaminations: isEmptyString(values.parallelExaminations)
        ? DEFAULT_PARALLEL_EXAMINATIONS
        : Math.max(values.parallelExaminations, DEFAULT_PARALLEL_EXAMINATIONS),
      skipCalculatingOfBlocks:
        validateForm(values).appointmentBlocks != undefined,
    }) > 0
  );
}

interface AppointmentBlockGroupFormProps {
  initialValues: AppointmentBlockGroupValues;
  onSubmit: (values: AppointmentBlockGroupValues) => Promise<void>;
  allMedicalAssistants: ApiUser[];
  allPhysicians: ApiUser[];
  blockedStaff: string[];
  freeStaff: string[];
  validateAvailability: (values: AppointmentBlockGroupValues) => void;
}

export interface AppointmentBlockGroupValues {
  type: OptionalFieldValue<ApiAppointmentType>;
  parallelExaminations: OptionalFieldValue<number>;
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
  allAppointmentTypes: Record<string, number>;
  mfas: string[];
  physicians: string[];
}

export function AppointmentBlockGroupForm(
  props: Readonly<AppointmentBlockGroupFormProps>,
) {
  const snackbar = useSnackbar();
  const physicianOptions = props.allPhysicians.map((option) => ({
    value: option.userId,
    label: fullName(option),
  }));

  const medicalAssistantsOptions = props.allMedicalAssistants.map((option) => ({
    value: option.userId,
    label: fullName(option),
  }));

  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={async (appointments) => {
        if (hasAtLeastOneAppointmentInGroup(appointments)) {
          await props.onSubmit(appointments);
        } else {
          snackbar.notification(
            "Es muss mindestens ein Termin enthalten sein.",
          );
        }
      }}
      validate={validateForm}
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
            left={
              <AppointmentCountWithDays
                appointments={values}
                appointmentDurations={values.allAppointmentTypes}
                parallelExaminations={
                  isEmptyString(values.parallelExaminations)
                    ? DEFAULT_PARALLEL_EXAMINATIONS
                    : Math.max(
                        values.parallelExaminations,
                        DEFAULT_PARALLEL_EXAMINATIONS,
                      )
                }
                skipCalculatingOfBlocks={
                  validateForm(values).appointmentBlocks != undefined
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
