/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Stack, Typography } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Formik, FormikErrors } from "formik";
import { Ref } from "react";
import { isEmpty, unique } from "remeda";

import {
  AppointmentStaffSelection,
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  TimeField,
  calculateAppointmentsPerBlock,
  calculateMaxParallelBookings,
  formatDateInput,
  formatTimeInput,
  getAppointmentDurationInMinutes,
  isAfterTime,
  isBeforeTime,
  parseTime,
  toLocalDateTime,
} from "@eshg/lib-employee-portal";
import { NumberField, OptionalFieldValue } from "@eshg/lib-portal";
import {
  ApiAppointmentBlock,
  ApiAppointmentType,
  ApiUser,
} from "@eshg/school-entry-api";

import {
  useAppointmentBlockApi,
  useAppointmentStandardDurationsApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { useUpdateAppointmentBlock } from "@/lib/businessModules/schoolEntry/api/mutations/appointmentBlockApi";
import { getValidateUpdateAppointmentBlockQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockApi";
import { useGetAppointmentStandardDurationsQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentStandardDuration";

interface UpdateAppointmentBlockProps {
  appointmentBlock: ApiAppointmentBlock;
  allPhysicians: ApiUser[];
  allMfas: ApiUser[];
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onClose: (force?: boolean) => void;
  refetchEvents: () => void;
}

interface UpdateAppointmentBlockValues {
  startTime: string;
  endTime: string;
  parallelExaminations: number;
  physicians: string[];
  mfas: string[];
}

function mapFormValuesToApiValues(
  appointmentBlock: ApiAppointmentBlock,
  values: UpdateAppointmentBlockValues,
) {
  return {
    appointmentBlockId: appointmentBlock.id,
    apiUpdateAppointmentBlockRequest: {
      start: toLocalDateTime(
        formatDateInput(appointmentBlock.start),
        values.startTime,
      ),
      end: toLocalDateTime(
        formatDateInput(appointmentBlock.end),
        values.endTime,
      ),
      parallelExaminations: values.parallelExaminations,
      physicians: values.physicians,
      mfas: values.mfas,
      consultants: [],
    },
  };
}

export function UpdateAppointmentBlockSidebar(
  props: UpdateAppointmentBlockProps,
) {
  const { appointmentBlock, onCancel } = props;
  const updateAppointmentBlock = useUpdateAppointmentBlock();
  const standardDurationApi = useAppointmentStandardDurationsApi();
  const appointmentBlockApi = useAppointmentBlockApi();
  const { data: standardDurations } = useSuspenseQuery(
    useGetAppointmentStandardDurationsQuery(standardDurationApi),
  );

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

  function handleValidate(values: UpdateAppointmentBlockValues) {
    const errors: FormikErrors<UpdateAppointmentBlockValues> = {};

    if (isEmpty(values.physicians) && isEmpty(values.mfas)) {
      const msg =
        "Es muss mindestens ein Arzt/eine Ärztin oder ein:e MFA ausgewählt sein.";
      errors.physicians = msg;
      errors.mfas = msg;
    }

    return errors;
  }

  async function handleUpdate(values: UpdateAppointmentBlockValues) {
    await updateAppointmentBlock.mutateAsync(
      mapFormValuesToApiValues(appointmentBlock, values),
    );

    props.onClose(true);
    props.refetchEvents();
  }

  return (
    <Formik
      initialValues={{
        startTime: formatTimeInput(appointmentBlock.start),
        endTime: formatTimeInput(appointmentBlock.end),
        parallelExaminations: appointmentBlock.parallelExaminations,
        physicians: appointmentBlock.physicians,
        mfas: appointmentBlock.mfas,
      }}
      validate={handleValidate}
      onSubmit={handleUpdate}
    >
      {({ values, isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title="Terminblock bearbeiten">
            <Stack gap={2}>
              <Typography level="title-md">Termin:</Typography>
              <Grid container spacing={2}>
                <Grid xxs>
                  <TimeField
                    name="startTime"
                    label="Startzeit"
                    required="Bitte eine Startzeit angeben."
                    validate={(value) =>
                      validateAppointmentStartTime(value, appointmentBlock)
                    }
                  />
                </Grid>
                <Grid xxs>
                  <TimeField
                    name="endTime"
                    label="Endzeit"
                    required="Bitte eine Endzeit angeben."
                    validate={(value) =>
                      validateAppointmentEndTime(
                        value,
                        values.startTime,
                        appointmentBlock,
                        standardDurations,
                      )
                    }
                  />
                </Grid>
              </Grid>
              <NumberField
                name="parallelExaminations"
                label="Parallele Untersuchungen"
                required="Bitte die Anzahl paralleler Untersuchungen angeben."
                validate={(value) =>
                  validateParallelExaminations(value, appointmentBlock)
                }
              />
              <AppointmentStaffSelection
                physicianOptions={physicianOptions}
                medicalAssistantOptions={medicalAssistantsOptions}
                validateAppointmentBlocks={() =>
                  mapFormValuesToApiValues(appointmentBlock, values)
                }
                getCheckAvailabilityQuery={() =>
                  getValidateUpdateAppointmentBlockQuery(
                    appointmentBlockApi,
                    mapFormValuesToApiValues(appointmentBlock, values),
                  )
                }
                singleColumn
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function validateAppointmentStartTime(
  value: string,
  appointmentBlock: ApiAppointmentBlock,
) {
  if (isBeforeTime(value, formatTimeInput(appointmentBlock.start))) {
    return "Die Startzeit muss im Terminblock liegen.";
  }
  const bookedAppointments = appointmentBlock.bookedAppointments;
  if (bookedAppointments.length > 0) {
    const earliestBookedAppointment = bookedAppointments.toSorted(
      (a, b) => a.start.getTime() - b.start.getTime(),
    )[0];

    if (isAfterTime(value, formatTimeInput(earliestBookedAppointment!.start))) {
      return "Es sind bereits Termine vor dieser Zeit gebucht.";
    }
  }
  return undefined;
}

function validateAppointmentEndTime(
  value: string,
  startTime: string,
  appointmentBlock: ApiAppointmentBlock,
  standardDurations: Partial<Record<ApiAppointmentType, number>>,
) {
  if (!isAfterTime(value, startTime)) {
    return "Die Endzeit muss nach der Startzeit liegen.";
  }

  if (isAfterTime(value, formatTimeInput(appointmentBlock.end))) {
    return "Die Endzeit muss im Terminblock liegen.";
  }

  const bookedAppointments = appointmentBlock.bookedAppointments;
  if (bookedAppointments.length > 0) {
    const latestBookedAppointment = bookedAppointments.toSorted(
      (a, b) => b.end.getTime() - a.end.getTime(),
    )[0];

    if (isBeforeTime(value, formatTimeInput(latestBookedAppointment!.end))) {
      return "Es sind bereits Termine nach dieser Zeit gebucht.";
    }
  }

  if (
    appointmentBlock.types.every(
      (type) =>
        calculateAppointmentsPerBlock(
          type,
          parseTime(startTime, appointmentBlock.start),
          parseTime(value, appointmentBlock.end),
          standardDurations,
        ) === 0,
    )
  ) {
    const appointmentDurationInMinutes =
      unique(
        appointmentBlock.types.map((type) =>
          getAppointmentDurationInMinutes(type, standardDurations),
        ),
      ).join(", ") + " Minuten";
    return `Die Dauer ist nicht teilbar durch die Terminlängen: ${appointmentDurationInMinutes}.`;
  }
  return undefined;
}

function validateParallelExaminations(
  value: OptionalFieldValue<number>,
  appointmentBlock: ApiAppointmentBlock,
) {
  if (typeof value !== "number") {
    return "Bitte die Anzahl paralleler Untersuchungen angeben.";
  }
  if (value < 1) {
    return "Die Anzahl der parallelen Untersuchungen muss mindestens 1 betragen.";
  }
  if (value > 10) {
    return "Die Anzahl der parallelen Untersuchungen darf höchstens 10 betragen.";
  }
  if (value > appointmentBlock.parallelExaminations) {
    return "Die Anzahl der parallelen Untersuchungen kann nicht erhöht werden.";
  }
  const maxParallelBookings = calculateMaxParallelBookings(
    appointmentBlock.bookedAppointments,
  );
  if (value < maxParallelBookings) {
    return `Die Anzahl der parallelen Untersuchungen muss mindestens gleich der maximalen Anzahl der gleichzeitig gebuchten Termine (${maxParallelBookings}) sein.`;
  }
  return undefined;
}
