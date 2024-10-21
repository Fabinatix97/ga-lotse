/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/base";
import { ApiLocationSelectionMode } from "@eshg/employee-portal-api/schoolEntry";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { Divider, Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isDefined, isEmpty, mapToObj } from "remeda";

import { AppointmentTypeConfig } from "@/lib/businessModules/schoolEntry/api/models/AppointmentTypeConfig";
import { CreateAppointmentBlockGroupValues } from "@/lib/businessModules/schoolEntry/features/appointmentBlocks/appointmentBlocksGroupForm/CreateAppointmentBlockGroupForm";
import { APPOINTMENT_TYPE_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { AppointmentBlockGroupFields } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockGroupFields";
import { AppointmentCountWithDays } from "@/lib/shared/components/appointmentBlocks/AppointmentCountWithDays";
import { AppointmentLocationSelection } from "@/lib/shared/components/appointmentBlocks/AppointmentLocationSelection";
import { AppointmentStaffSelection } from "@/lib/shared/components/appointmentBlocks/AppointmentStaffSelection";
import { validateAppointmentBlock } from "@/lib/shared/components/appointmentBlocks/validateAppointmentBlock";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { FormSheet } from "@/lib/shared/components/form/FormSheet";
import { fullName } from "@/lib/shared/components/users/userFormatter";
import { validateFieldArray } from "@/lib/shared/helpers/validators";

const DEFAULT_PARALLEL_EXAMINATIONS = 1;

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
  const appointmentDurations = Object.fromEntries(
    props.allAppointmentTypes.map((currentType) => [
      currentType.appointmentTypeDto,
      currentType.standardDurationInMinutes,
    ]),
  );

  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      validate={(values) => validateForm(values, props.allAppointmentTypes)}
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
            onCancel={routes.appointmentBlockGroups.overview}
          />
        </FormSheet>
      )}
    </Formik>
  );
}
